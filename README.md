# Web Story creation Tool

This is a private fork of [web-stories-wp](https://github.com/google/web-stories-wp) implementing a pwa story-editor.

Using this editor, one can edit a story in the WYSIWYG editor used in [web stories plugin](https://wp.stories.google/) in a stand-alone form factor.
Stories then can be exported as a zip which will have the following content
- index.html  - [amp-story](https://amp.dev/about/stories/) output.
- README.txt  - contains instruction for how to use this output into a webpage.
- config.json - for internal use ( currently being used to import web stories made for this tool )
- files for 1p media (if used).


## TO-DO ( Prior to play test )

- [x] Groundwork ( mainly webpack ).
- [x] Barebones editor similar to what is shown in story editor.
- [x] Make preview work.
- [x] Download as Zip ( export )
   - [x] 3p media only 
   - [x] 1p and 3p media
- [x] Import a Zip
   - [x] 3p media only 
   - [x] 1p and 3p media
- [x] Add persistence to story editor.
- [x] PWA features
  - [x] works offline
  - [x] is installable 
- [x] 1p media panel
- [x] add persistence for 1p media ( elements in story and 1P media library panel )
