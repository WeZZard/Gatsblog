---
title: An Introduction to Gatsblog
subtitle: 'A Blog Built with Gatsby.js'
category: Showcase
tags: [Blog, Design, Programming]
isPublished: false
---

As I mentioned in the Hello World post, there are no blog systems fulfill
all my needs, time that I have such a deep touch with frontend tech stack.

Thus I got started to make my own one. And frankly, this is the first
I just decided to write down the whole process, from design to
implementation, to make a memento of my journey, which conducted by an
iOS developer with industrial design background, into modern frontend tech
stack.

## Sophisticated Grid System

## Semi-Live Editing

## Responsive Image with Retina Display Support

## KaTex

Because I'm a fan of math, Gatsby supports inline KaTex syntax like
`$$a^2 + b^2 = c^2$$` which rendered as $$a^2 + b^2 = c^2$$, and block
KaTex syntax:

```katex
$$
\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} \equiv 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }
$$
```

$$
\frac{1}{\Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{\frac25 \pi}} \equiv 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}} {1+\frac{e^{-8\pi}} {1+\cdots} } } }
$$

```katex
$$
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
$$
```

$$
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
$$

```katex
$$
\int u \frac{dv}{dx}\,dx=uv-\int \frac{du}{dx}v\,dx
$$ 
```

$$
\int u \frac{dv}{dx}\,dx=uv-\int \frac{du}{dx}v\,dx 
$$

## Enhanced with MDX

### React Live

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

### Code Block with Path Label

By putting `path=path_of_file` after the _language_ metadata in the
beginning line of the fenced code block

```markdown
```c path=src/main.c
#include <stdio>

int main(int argc, char[] * args) {
    printf("Hello, world!\n");
    return 0;
}
​​```
```

you can get a code block likes

```c path=src/main.c
#include <stdio>
int main(int argc, char[] * args) {
    printf("Hello, world!\n");
    return 0;
}
```

## Statically Deployed

