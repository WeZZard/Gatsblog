---
title: Hello, World!
category: Publication
---

Hello, world!

I haven't been writing blog posts for a long time. The reason why I had given
up blogging is that currently there is not a blog system fulfill all my needs. I
tried to get used to Medium. I love its reply system -- which guides people to 
write a new post instead of a simple comment -- actually this was what the world
of blog used to be, but the render effects of code blocks sucks. Moreover, I'm a
multi-linguist, I want to write both in Chinese and English at the same time,
and sometimes Japanese and German. But the quality of Chinese character's render
effects on Medium doesn't match those of Latin script or even Japanese Kana. 
After 1 year of bearing such a torture of playing with mismatched product 
quality on Medium, finally I decided to implement my own.

## Jekyll and Abandoned

Firstly, I chose Jekyll. But soon, I abandoned. Frankly, I don't like Ruby.
I'm a Chinese grew up in Mainland China. For one of the core concepts of
Simplified Chinese and Ruby is both "simplify for simplification", and such a
kind of simplification rule produces many irregular cases which increases brain
burden after all, thus I don't like both. Ruby's grammar is highly irregular
which is just like the strokes of characters is more irregular in Simplified
Chinese than what they were in Traditional Chinese. You write less on the
surface, but remember more and take more time to understand what you written
under the surface.

There are more historical details I can tell in between China and Japan about
how simplification "took over" two countries, which one is the "motherland" of 
Simplified Chinese and the other Ruby's.

Japan got started to simplify the pronunciation system of Chinese characters
(Kanji) in Meiji Restoration. Several decades later, 9 days after the foundation
of the People's Republic of China, Japan announced the use of its new form of
Chinese characters -- Shinjitai (literally means "new character form"), which
is just another approach to simplify Traditional Chinese. 

While Japan simplified the Chinese character's pronunciation system, it is 
impossible for China. For there are already tons of homophonic words in Chinese,
whenever you are speaking Chinese or Japanese, the number of homophonic words
would dramatically increase after you did whatever simplification to the
pronunciation system. When speaking Japanese, you can get rid of those
homophonic Chinese words by "falling back" to native Japanese words or phonetic
interpreted words came from languages other than Chinese. But when speaking
Chinese, there are no "fallback words". Thus we don't simplify the pronunciation
system of our language.

Thus the only simplification we did to our language is just the simplification
to the form of characters. About ten years after the foundation of the People's 
Republic of China, the central government announced to gradually replace the use
of Traditional Chinese with Simplified Chinese.

Well, the reason why I had abandoned Jekyll is not as complicated as the
historical details I mentioned above. Just like other blog systems that I have
used before, Jekyll doesn't fulfill all my needs. The user defined excerpt
markup is awesome, but I also want shortcodes in WordPress. I had to write
additional codes to generate tags and category if I wanted to host it on GitHub
Pages.

## Zola and Abandoned

Because I've been learning Rust for weeks when I decided to implement my own
blog system, I also searched some blog frameworks written in Rust. Then I found
Zola.

Truth be told, Zola is a good book generator. Even you can use it to generate 
documentations and guides. But as a blog system, it fails.

It was designed to be a single binary such that the extension of the system is
extremely difficult. Because of its simplicity, it is the best choice if it hits
all your needs and the only thing you have to do is to design a theme. But soon
fails totally if one of your needs is out of its spec list.

## Gatsby.js and Determined

Occasionally, I found Gatsby.js. Or say, the meet with Gatsby.js is my destiny.
After trails of Jekyll and Zola, it no longer scares me that to take some time
on assessing a blog system by writing some trail codes with it.

Just after downloading the tutorial project and scratching with lines of code, I
decided to implement my own blog system with Gatsby.js.

Gatsby.js is built upon React.js and node, which I have never got touched with
before. But picking up these two skills is quite simple. The expression is
straight and easy to understand. The concept behind Gatsby.js is more like
data-oriented programming. But it doesn't matter that if you don't know such a
buzz word. You can imagine that Gatsby.js works like a pipeline, and the only
thing you have to do is just to "hook-up" on correct time and add your custom
contents.

## When MDX Met with Gatsby.js

After several days crawling on Gatsby.js community, I quickly found an awesome
upgrade to traditional Markdown: MDX.

MDX is JSX enhanced Markdown, which means you can insert JSX tags in Markdown
documents and the framework would replace it with real React.js component on
behalf of you when rendering the document.

This means I can implement a replacement of WordPress shortcodes with JSX tags
and React.js component now. Some features like left/right float figures, charts
and components out of current imagination can also be easily extended into the
system now.

## Struggle with Gatsby.js

The perspective is beautiful but the road is frustrating.

Since the framework interprets MDX document in JavaScript, and the JavaScript
escapes backslash (/) escaped tokens (which means interprets valid escaped
tokens likes "\n" into a real newline and invalid escaped tokens likes "\L" into
"L"), the first thing I have to do is to get the framework stopped doing that.

For the framework converts the MDX document into Markdown AST firstly, and then 
into MDX AST, this mis-interpretation can be corrected after Markdown AST
generation by inserting a guard backslash before each backslash in the Markdown
AST. The principal behind this is simple: Since the JavaScript blindly escapes
everything after a backslash, so just get that backslash escaped.  

You may wonder that there are also escaped characters in Markdown grammar, what
happens to them when you blindly inserting a guard backslash before each existed
backslash?

Well, the answer is simple: The escaped characters of the Markdown language in
the document have been escaped in the progress of converting MDX document into
Markdown AST, which means they are no longer escaped characters in the AST now,
you can safely do it on generated Markdown AST.

After fixed the backslash issue, there were still many issues waiting for me.
But building a system with Gatsby.js is joyful.

## Stage of the Project

As I mentioned before, there are no blog systems fulfill all my needs. Does
Gatsby.js fulfill all my needs?

Yes. Though there is not an out-of-box Gatsby.js project fulfills all my needs,
but building what I need is quite simple with Gatsby.js.

Currently this blog implements

- A Responsive design

- Basic Markdown syntax support

- Inline and block KaTex syntax support

- Tags and category

- Table-of-contents for sectioned posts

- Creative Common 4.0 license claimer

- RSS feed

But this is not the end. In the next stage the project would add support to:
  
- Webmention
  
- "Shortcode" for major video sites

And the site would finally implement a beautiful render effect for Chinese
character and Latin script mixed documents which enables me to post in languages
I intentionally want to.

Since I decided to build this site in a couple of weeks, I didn't ship a very 
modern design. The appearance of the site is quit old school. But I have already
got a new design. Since refreshing the appearance of the site needs a lot of
time, it might be taken after half or one year.
 