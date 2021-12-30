# Web Story creation Tool

This is a private fork of [web-stories-wp](https://github.com/google/web-stories-wp) implementing a pwa story-editor.

Using this editor, one can edit a story in the WYSIWYG editor used in [web stories plugin](https://github.com/google/web-stories-wp) in a stand-alone form factor.

Try this project out [here](https://rtcamp.github.io/web-story-creation-tool)

## Current features 
- ### Export a Story
  - Stories then can be exported as a zip which will have the following content
    - `index.html`  - [amp-story](https://amp.dev/about/stories/) markup.
    - `README.txt`  - contains instruction for how to use this output and insert into a webpage.
    - `config.json` - for internal use ( currently being used to import web stories made for this tool )
    - files for 1p media (if used).
  - This exported assets then can be used one any webpage ( with the instructions provided in `README.txt` in the exported zip ) 
- ### Import a Story
  - Stories exported from this PWA then can also be imported by anyone using the zip file.
- ### 1p Media Support
  - Support for 1p media without any backend.
- ### Support with [HUGO](https://gohugo.io/) 
  Assuming you have a hugo site already setup follow the following instructions to add a story into it. ( [hugo quikstart guide](https://gohugo.io/getting-started/quick-start/) )
  - Follow instructions [here](https://gist.github.com/codingcarrots20/2be409105bce5cbc73b5f8184a730078) to add a shortcode to your hugo site.
  - Use [web story creation tool](https://rtcamp.github.io/web-story-creation-tool) to create a story and export/download it.
  - Paste exported/downloaded zip into `static` folder and unzip it there ( Let's assume this unzipped folder is called `web-story` ).
  - use `{{< web-story dir="web-story" >}}` in your md files.

## For Devs

For running locally use `npm run playground:dev`

For running locally with pwa features
- `npm run playground:build`
- `npm run playground:serve`

