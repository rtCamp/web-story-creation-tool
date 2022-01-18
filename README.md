# Web Story creation Tool

This is a fork of [web-stories-wp](https://github.com/google/web-stories-wp) project for creating a pwa story creation tool.

See demo [here](https://rtcamp.github.io/web-story-creation-tool)


## Features

- ### Exporting Story

    - Stories can be exported as a zip which will have the following content
        - `index.html`  - [amp-story](https://amp.dev/about/stories/) markup.
        - `README.txt`  - contains instruction for how to use this output and insert into a webpage.
        - `config.json` - for internal use ( currently being used to import web stories made for this tool )
        - files for 1p media (if used).
    - These exported assets can be used on any webpage ( with the instructions provided in `README.txt` in the exported zip )
  
- ### Importing Story

    - Stories exported from this tool can also be imported by anyone using the zip file
  
- ### Local Media Support

    - Support for local media without any backend which gets saved in web storage ( IndexDB ).
  
- ### Support for [HUGO](https://gohugo.io/) 

  If you have a hugo site already setup, you may follow these instructions to embed a story.
    - Follow instructions [here](https://gist.github.com/codingcarrots20/2be409105bce5cbc73b5f8184a730078) to add a shortcode to your hugo site.
    - Use [web story creation tool](https://rtcamp.github.io/web-story-creation-tool) to create a story and export/download it.
    - After unzipping the exported/downloaded zip file, drop it into the [static folder](https://gohugo.io/content-management/static-files/) of your Hugo site.
    - Lets say this unzipped folder name is `web-story` , you may then use `{{< web-story dir="web-story" >}}` in your `.md` files to embed the story.



## Development

For development use `npm run playground:dev`.

For running locally with pwa features

- `npm run playground:build`
- `npm run playground:serve`

