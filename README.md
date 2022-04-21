# Web Story creation Tool

This is a fork of [web-stories-wp](https://github.com/google/web-stories-wp) project for creating a pwa story creation tool.

[![Latest Release)](https://img.shields.io/github/v/release/googleforcreators/web-stories-wp?include_prereleases)](https://github.com/googleforcreators/web-stories-wp/releases)
[![Commit activity](https://img.shields.io/github/commit-activity/m/googleforcreators/web-stories-wp)](https://github.com/googleforcreators/web-stories-wp/pulse/monthly)
[![Code Coverage](https://codecov.io/gh/googleforcreators/web-stories-wp/branch/main/graph/badge.svg)](https://codecov.io/gh/googleforcreators/web-stories-wp)
[![License](https://img.shields.io/github/license/googleforcreators/web-stories-wp)](https://github.com/googleforcreators/web-stories-wp/blob/main/LICENSE)


[![Build](https://img.shields.io/github/workflow/status/googleforcreators/web-stories-wp/Build%20plugin?label=Build)](https://github.com/googleforcreators/web-stories-wp/actions?query=branch%3Amain)
[![Integration Tests](https://img.shields.io/github/workflow/status/googleforcreators/web-stories-wp/Integration%20Tests?label=integration%20tests)](https://github.com/googleforcreators/web-stories-wp/actions?query=branch%3Amain)
[![E2E Tests](https://img.shields.io/github/workflow/status/googleforcreators/web-stories-wp/E2E%20Tests?label=e2e%20tests)](https://github.com/googleforcreators/web-stories-wp/actions?query=branch%3Amain)
[![JS Tests](https://img.shields.io/github/workflow/status/googleforcreators/web-stories-wp/JavaScript%20Unit%20Tests?label=js%20tests)](https://github.com/googleforcreators/web-stories-wp/actions?query=branch%3Amain)
[![PHP Tests](https://img.shields.io/github/workflow/status/googleforcreators/web-stories-wp/PHP%20Unit%20Tests?label=php%20tests)](https://github.com/googleforcreators/web-stories-wp/actions?query=branch%3Amain)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/googleforcreators/web-stories-wp.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/GoogleForCreators/web-stories-wp/alerts/)

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

