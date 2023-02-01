---
title: "A Study of LLVM ADT: ilist, iplist and simple_ilist"
category: Programming
tags: [LLVM, ADT, C++]
---

## Introduction

`ilist` is an intrusive double-linked list -- which means that each linked node stores its data and the node pointers in the same structure. There is no such kind of linked-list implemented containers shipped with the C++ standard library.

`iplist` is a purely intrusive list. Currently, `ilist` delegates its implementation to `iplist` with `using` grammar.

`simple_ilist` is a simple intrusive list implementation that never takes ownership of anything inserted in it. Moreover, unlike `iplist` and `ilist`, a `simple_ilist` never deletes values and has no callback traits.

## Key Features

### Intrusiveness

Unlike C++ standard library containers not require their elements to inherit a base class, `iplist` and its derived classes require their nodes to inherit `ilist_node`.

> Privately inherited classes shall friend `llvm::ilist_detail::NodeAccess`.

`ilist_node` eventually inherits `ilist_node_base<bool>` which contains the `Prev` and `Next` pointer that points to the previous node and the next node.

This makes the data carried by the node class get laid out right below the previous node pointer and the next node pointer of its superclass - `ilist_node`. This is what we called an intrusive list.

At the same time, if you want to override the standard behaviors of the containing intrusive list do against the node class which includes deleting a node, adding a node to the list, removing a node from the list and moving a node from one list to another, you can also offer traits of `ilist_node` as a template argument of the list.

```cpp
template <typename NodeTy>
struct ilist_alloc_traits {
  static void deleteNode(NodeTy *V);
};
template <typename NodeTy>
struct ilist_noalloc_traits {
  static void deleteNode(NodeTy *V);
};
```

```cpp
template <typename NodeTy>
struct ilist_callback_traits {
  void addNodeToList(NodeTy *);
  void removeNodeFromList(NodeTy *);
  template <class Iterator>
  void transferNodesFromList(ilist_callback_traits &OldList, Iterator /*first*/, Iterator /*last*/);
};
```

```cpp
template <typename NodeTy>
struct ilist_node_traits :
  ilist_alloc_traits<NodeTy>,
  ilist_callback_traits<NodeTy> {};
```

### Sentinel Tracking

User code can check if an `ilist_node` is a sentinel at runtime by checking the result of `bool ilist_node::isSentinel() const`.

If an `ilist_node` derived class didn't instantiate the templated class `ilist_node` with template argument `ilist_sentinel_tracking<true>`, there would be a `static_assert` come up at compile time.

```cpp
// ilist_node publicly inherits ilist_node_impl
class ilist_node_impl {

public:

  /// Check whether this is the sentinel node.
  ///
  /// This requires sentinel tracking to be explicitly enabled. Use the
  /// ilist_sentinel_tracking<true> option to get this API.
  bool isSentinel() const {
    static_assert(OptionsT::is_sentinel_tracking_explicit, "Use ilist_sentinel_tracking<true> to enable isSentinel()");
    return node_base_type::isSentinel();
  }

}
```

### Tagging

Since there is only one pair of node pointers on an `ilist_node`-inherited class, we can imply that instances of such a class are only able to be added to one intrusive list at one time. But with `ilist_tag`, a node can be stored in multiple LLVM intrusive lists.

Here is an example in LLVM's doc:

```cpp
struct A {};
struct B {};
struct N : ilist_node<N, ilist_tag<A>>, ilist_node<N, ilist_tag<B>> {};

void foo() {
  simple_ilist<N, ilist_tag<A>> ListA;
  simple_ilist<N, ilist_tag<B>> ListB;
  N N1;
  ListA.push_back(N1);
  ListB.push_back(N1);
}
```

This is because, for `ilist_node` subclasses, multiple inheritances of `ilist_node`` gives the node multiple pair of node pointers.

Then for `simple_ilist<NodeTy, ilist_tag<TagTy>>`, the implementation of intrusive list's ultimate content managing interfaces manipulate the node by casting it into `node_pointer` which eventually interpreted into `ilist_node_impl<ilist_detail::node_options<NodeTy, false, false, ilist_tag<TagTy>>>`.

```cpp  
template <class OptionsT>
struct IteratorTraits<OptionsT, false> {
  using node_pointer = ilist_node_impl<OptionsT> *;
};

template <class OptionsT, bool IsReverse, bool IsConst>
class ilist_iterator {  
  using Traits = ilist_detail::IteratorTraits<OptionsT, IsConst>;
private:
  // node_pointer eventually interpreted as:
  // ilist_node_impl<
  //   ilist_detail::node_options<
  //     NodeTy,
  //     false,
  //     false,
  //     ilist_tag<TagTy>
  //   >
  // > *
  using node_pointer = typename Traits::node_pointer;

  node_pointer NodePtr = nullptr;
}

template <typename T, class... Options>
class simple_ilist: ... {
  // For simple_ilist<NodeTy, ilist_tag<TagTy>>
  // OptionsT eventually interpreted as:
  // ilist_detail::node_options<NodeTy, false, false, ilist_tag<TagTy>>
  using OptionsT = typename ilist_detail::compute_node_options<T, Options...>::type;
public:
  using iterator = ilist_iterator<OptionsT, false, false>;
}
```

## List Interface

### Accessing Basic Properties

`base_list_type`[^1] inherited interface:

- size brought by using base_list_type::size;

### Managing Contents

`iplist_impl` inherited interface:

- void swap(iplist_impl&)
- iterator insert(iterator, pointer)
- iterator insert(iterator, const_reference)
- iterator insertAfter(iterator, pointer)
- pointer remove(const iterator&)
- pointer remove(pointer)
- pointer remove(reference)
- iterator erase(iterator)
- void clear()
- void push_front(pointer)
- void push_back(pointer)
- void pop_front()
- void pop_back()
- void insert<Int\>(iterator where, InIt first, InIt last)
- void splice<Int\>(iterator, iplist_impl&)
- void splice<Int\>(iterator, iplist_impl&, iterator first)
- void splice<Int\>(iterator, iplist_impl&, iterator first, iterator last)
- void splice<Int\>(iterator, iplist_impl&, reference)
- void splice<Int\>(iterator, iplist_impl&, pointer)
- void merge<Compare\>(iplist_impl&, Compare)
- void merge(iplist_impl&)

`base_list_type`[^1] inherited interface:

- sort brought by using base_list_type::sort;

### Iterators

`base_list_type`[^1] inherited interface:

- begin brought by using base_list_type::begin;
- end brought by using base_list_type::end;
- rbegin brought by using base_list_type::rbegin;
- rend brought by using base_list_type::rend;
- empty brought by using base_list_type::empty;
- front brought by using base_list_type::front;
- back brought by using base_list_type::back;

## Node Interface

### Managing Pointers

`base_node_type`[^2] inherited interface:

- void setPrev(ilist_node_base *)
- void setNext(ilist_node_base *)
- ilist_node_base *getPrev() const
- ilist_node_base *getNext() const

### Sentinel

`node_base_type` inherited interface:

- bool isSentinel const [^3]
- bool isKnownSentinel() const
- void initializeSentinel()

## Intrusive List Classes

- iplist
  - ilist
- simple_ilist

## Source Files

- include/llvm/ADT/ilist_base.h
- include/llvm/ADT/ilist_iterator.h
- include/llvm/ADT/ilist_node_base.h
- include/llvm/ADT/ilist_node_options.h
- include/llvm/ADT/ilist_node.h
- include/llvm/ADT/ilist.h
- include/llvm/ADT/simple_ilist.h

[^1]: This type alias usually gets ineterpreted into a ilist_base<bool enable_sentinel_tracking\> class such as simple_ilist.

[^2]: This type alias usually gets ineterpreted into ilst_node_base<bool enable_sentinel_tracking\>.

[^3]: This method is missing for derived classes of ilist_node_base<false\>.
