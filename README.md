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

## Improvements / bug fixes needed

### Must(s)
- [ ] Increase autosave frequency or save after every update on canvas.
- [ ] Preview should work when offline ( or add some notice that on preview page about preview not working offline )
  - amp packages should also be cached and webpack should handle preview html.
- [x] Problems while importing the story story title input is not visible as in it vanishes completely same goes for Reset Add title does appear back after page reload. ( reported by - [@amovar18](https://github.com/amovar18) )

### Should(s) 
- [ ] Add delete media callback 
  - Media in the library panel can't be permanently deleted currently.
- [ ] Add update media callback.
- [ ] When importing skip loading 1p media which is already in the library. 
### Could(s)
- [ ] Preview could be more like an example web-page that show story in that context.
- [ ] Rather than building a PWA, build as an electron renderer bundle.
  - This will, in theory, eliminate the need for hosting and cross-browser compatibility would be a non-issue since electron renders into chromium.
 ### Maybe(s)
- [ ] Store data ( media, story state, etc ) in file systems using the main thread of electron.

