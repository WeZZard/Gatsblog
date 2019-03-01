---
title: 'An Introduction to Gatsblog'
subtitle: 'A Blog Built with Gatsby.js'
category: Showcase
tags: [Blog, Design, Code]
isPublished: false
---

As I mentioned in the previous post, there are no blog systems fulfill all my
needs, thus I got started to make my own one. And frankly, this is the first
time that I have such a deep touch with frontend tech stack.

I just decided to write down the whole process, from design to implementation,
to make a memento of my journey, which conducted by an iOS developer with
industrial design background, into modern frontend tech stack.

# Highlights

## Statically Deployed

## Live Preview

## Rhythmic Design

## React Live

```javascript react-live
class Counter extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({ count: state.count + 1 }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <center>
        <h3>{this.state.count}</h3>
      </center>
    );
  }
}
```

## Code Block with Path Label

By putting `path=path_of_file` after the _language_ metadata in the beginning
line of the fenced code block

`````markdown
````c path=src/main.c
#include <stdio>

int main(int argc, char[] * args) {
    return 0;
}
​```
````
`````

````

you can get a code block likes

```c path=src/main.c
#include <stdio>
int main(int argc, char[] * args) {
    return 0;
}
```
````
