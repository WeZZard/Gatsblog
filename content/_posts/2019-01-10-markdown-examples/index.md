---
title: Markdown Examples
tags: [Markdown]
category: Introduction
---

## Headings

You can give sections of the document with headings

```markdown
# First Heading
## Second Heading
### Third Heading
#### Forth Heading
##### Fifth Heading
###### Sixth Heading
```


## Paragraphs

Paragraphs are separated by a blank line.

Two spaces at the end of a line produces a line break.

## Line Breaks
To create a line break (&lt;br/&gt;), end a line with two or more spaces, and 
then type return.

```markdown
This is the first line.  
And this is the second line.
```

This is the first line.  
And this is the second line.

## Emphasis

You can add emphasis by making text bold or italic.

### Italic

```markdown
Italicized text is the *cat's meow*.
```

Italicized text is the *cat's meow*.

```markdown
Italicized text is the _cat's meow_.
```

Italicized text is the _cat's meow_.

```markdown
A*cat*meow
```

A*cat*meow

### Bold

```markdown
I just love **bold text**.
``` 

I just love **bold text**.

```markdown
I just love __bold text__.
```

I just love __bold text__.

```markdown
Love**is**bold
```

Love**is**bold

### Bold and Italic

```markdown
This text is ***really important***.
```

This text is ***really important***.

```markdown
This text is ___really important___.
```

This text is ___really important___.

```markdown
This text is __*really important*__.
```

This text is __*really important*__.

```markdown
This text is **_really important_**.
```

This text is **_really important_**.

## Link

```markdown
A [link][example].

[example]: http://example.com
```

A [link][example].

[example]: http://example.com

## Image

```markdown
![Image](WangQiuQiu.jpg "Wang Qiu-Qiu")
```

![Image](WangQiuQiu.jpg "Wang Qiu-Qiu")

## Lists

### Bullet List 1

```markdown
* apples
* oranges
* pears
```

* apples
* oranges
* pears

### Bullet List 2

```markdown
- apples
- oranges
- pears
```

- apples
- oranges
- pears
  
### Numbered List

```markdown
1. wash
2. rinse
3. repeat
```

1. wash
2. rinse
3. repeat

## Horizontal Rule

```markdown
Three or more...

---

Hyphens

***

Asterisks

___

Underscores
```

Three or more...

---

Hyphens

***

Asterisks

___

Underscores

## Code
To denote a word or phrase as code, enclose it in tick marks (\`).

```markdown
At the command prompt, type `nano`.
```

At the command prompt, type `nano`.

### Escaping Tick Marks
If the word or phrase you want to denote as code includes one or more tick 
marks, you can escape it by enclosing the word or phrase in double tick 
marks (\`\`).

```markdown
``Use `code` in your Markdown file.``
```

``Use `code` in your Markdown file.``

## Code Blocks
To create code blocks, indent every line of the block by at least four spaces or
one tab.

```markdown

    <html>
      <head>
      </head>
    </html>
```

    <html>
      <head>
      </head>
    </html>

## Blockquote

```markdown
> Markdown uses email-style > characters for blockquote.
```

> Markdown uses email-style > characters for blockquote.

## Inline HTML

```markdown
Inline <abbr title="Hypertext Markup Language">HTML</abbr> is supported.
```

Inline <abbr title="Hypertext Markup Language">HTML</abbr> is supported.

## Tables
To add a table, use three or more hyphens (---) to create each column’s header,
and use pipes (|) to separate each column. You can optionally add pipes on
either end of the table.

```markdown
| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |
```

The rendered output looks like this:

| Syntax      | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

Cell widths can vary, as shown below. The rendered output will look the same.

```markdown
| Syntax | Description |
| --- | ----------- |
| Header | Title |
| Paragraph | Text |
```

| Syntax | Description |
| --- | ----------- |
| Header | Title |
| Paragraph | Text |

### Alignment

You can align text in the columns to the left, right, or center by adding a 
colon (:) to the left, right, or on both side of the hyphens within the header
row.

```markdown
| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |
```

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

### Formatting Text in Tables

You can format the text within tables. For example, you can add links, code
(words or phrases in tick marks (`) only, not code blocks), and emphasis.

You can’t add headings, blockquote, lists, horizontal rules, images, or HTML 
tags.

### Escaping Pipe Characters in Tables
You can display a pipe (|) character in a table by using its HTML character code
(&#124;).

## Fenced Code Blocks
The basic Markdown syntax allows you to create code blocks by indenting lines by 
four spaces or one tab. If you find that inconvenient, try using fenced code 
blocks. Depending on your Markdown processor or editor, you’ll use three tick 
marks (\`\`\`) or three tildes (\~\~\~) on the lines before and after the code 
block. The best part? You don’t have to indent any lines!

    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "age": 25
    }
    ```

The rendered output looks like this:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

## Strikethrough

You can “strikethrough” words by putting a horizontal line through the center of 
them. The result looks like ~~this~~. This feature allows you to indicate that
 certain words are a mistake not meant for inclusion in the document. To 
 strikethrough words, use two tilde symbols (~~) before and after the words.

```markdown
~~Scratch this.~~
```

~~Scratch this.~~

## Task List

```markdown
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
```

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

## Footnotes

```markdown
Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.
```

Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.

    `{ my code }`

    Add as many paragraphs as you like.
