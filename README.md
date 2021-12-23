# Web Story creation Tool

This is a private fork of [web-stories-wp](https://github.com/google/web-stories-wp) implementing a pwa story-editor.

Using this editor, one can edit a story in the WYSIWYG editor used in [web stories plugin](https://wp.stories.google/) in a stand-alone form factor.
Stories then can be exported as a zip which will have the following content
- index.html  - [amp-story](https://amp.dev/about/stories/) output.
- README.txt  - contains instruction for how to use this output into a webpage.
- config.json - for internal use ( currently being used to import web stories made for this tool )
- files for 1p media (if used).

