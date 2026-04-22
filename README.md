# Mixtape Player

A standalone web player inspired by the screenshot layout: no framework, no build step, and a single JavaScript file you can embed in any page.

## Features

- custom element component: `<mixtape-player>`
- single-snippet widget mode
- support for local audio files selected in the browser
- direct drag-and-drop onto the player
- support for remote audio URLs
- waveform rendering with graceful fallback when remote sources do not expose CORS
- play/pause, previous/next, seek bar, volume, shuffle, and repeat
- clickable playlist track selection
- customization through JavaScript options and CSS custom properties
- ready-to-run demo in `index.html`

## Quick Start

Serve the project folder from any web server, then open the local URL in your browser.

The demo should be loaded over HTTP rather than opened directly from the filesystem.

## Single Snippet

```html
<script
  src="https://tuo-dominio.it/mixtape-player.js"
  data-mixtape-widget
  data-variant="full"
  data-config='{"title":"My Playlist","artist":"Various Artists","tracks":[{"title":"Intro","src":"/audio/intro.mp3"},{"title":"Remote Track","src":"https://example.com/audio/track.ogg"}]}'
></script>
```

This snippet automatically mounts the widget exactly where you place the script tag.

## Minimal Variant

```html
<script
  src="https://tuo-dominio.it/mixtape-player.js"
  data-mixtape-widget
  data-variant="minimal"
  data-config='{"title":"Single Track","artist":"Demo","tracks":[{"title":"Intro","src":"/audio/intro.mp3"}]}'
></script>
```

## Available Presets

- `full`
  Full player UI.
- `minimal`
  Essential version without waveform, tracklist, or secondary controls.
- `compact`
  A lighter middle ground with the tracklist and several secondary elements hidden.

You can start from a `variant` and then refine it with individual `show*` flags. Manual toggles always override the preset.

## Basic Usage

```html
<script src="/path/to/mixtape-player.js"></script>

<mixtape-player id="player"></mixtape-player>

<script>
  const player = document.querySelector("#player");

  player.load({
    title: "My Playlist",
    artist: "Various Artists",
    volume: 0.9,
    shuffle: false,
    repeatMode: "off",
    tracks: [
      { title: "Local file", src: "/audio/track-01.mp3" },
      { title: "Remote file", src: "https://example.com/audio/track-02.ogg" }
    ]
  });
</script>
```

## Local Files Chosen by the User

```html
<input id="files" type="file" accept="audio/*" multiple />

<script>
  const player = document.querySelector("#player");

  document.querySelector("#files").addEventListener("change", (event) => {
    player.loadFiles(event.target.files, { append: true });
  });
</script>
```

## Direct Drag and Drop

If `allowFileDrop` is `true`, you can drag audio files directly onto the player and they will be added to the playlist immediately.

## Inline JSON Alternative

```html
<script src="/path/to/mixtape-player.js"></script>

<mixtape-player>
  <script type="application/json">
    {
      "title": "Mixtape #2",
      "artist": "Radical Face",
      "tracks": [
        { "title": "Ursa Major", "src": "/audio/ursa-major.mp3" },
        { "title": "Remote Track", "src": "https://example.com/track.ogg" }
      ]
    }
  </script>
</mixtape-player>
```

## Available Config

```js
{
  variant: "full", // full | minimal | compact
  title: "My Playlist",
  artist: "Various Artists",
  cover: "/images/cover.jpg",
  coverCaption: "Curated by Simone",
  actionLabel: "Open release notes",
  actionHref: "https://example.com/release",
  brandHref: "https://example.com",
  brandIcon: "<svg>...</svg>",
  autoplay: false,
  initialTrack: 0,
  shuffle: false,
  repeatMode: "off", // off | all | one
  volume: 1,
  allowFileDrop: true,
  replaceOnDrop: false,
  dropLabel: "Drop audio files here",
  showCover: true,
  showArtist: true,
  showBrand: true,
  showAction: true,
  showStatus: true,
  showWaveform: true,
  showShuffle: true,
  showPrevNext: true,
  showPlay: true,
  showRepeat: true,
  showTime: true,
  showVolume: true,
  showMenu: true,
  showTracklist: true,
  theme: {
    "--mixtape-bg": "#d92323",
    "--mixtape-panel-bg": "#b60000",
    "--mixtape-list-bg": "#930000"
  },
  tracks: [
    {
      title: "Track Title",
      artist: "Artist",
      src: "/audio/track.mp3",
      duration: "04:20"
    }
  ]
}
```

## Useful CSS Variables

```css
mixtape-player.custom-theme {
  --mixtape-bg: #141414;
  --mixtape-panel-bg: #202020;
  --mixtape-list-bg: #101010;
  --mixtape-text: #ffffff;
  --mixtape-muted: rgba(255, 255, 255, 0.72);
  --mixtape-accent: #f1ff4b;
  --mixtape-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  --mixtape-radius: 30px;
  --mixtape-cover-radius: 22px;
}
```

## JavaScript API

- `element.load(config)` updates the full player configuration
- `element.setTheme(theme)` updates the component CSS variables
- `element.setTracks(tracks, options)` replaces the playlist
- `element.addTracks(tracks, options)` appends new tracks
- `element.loadFiles(fileList, options)` adds local files selected in the browser
- `element.play()` starts playback
- `element.pause()` pauses playback
- `window.MixtapePlayer.create(target, config)` creates and mounts the component
- `window.MixtapePlayer.mountFromScript(script)` mounts the widget from a script tag with `data-mixtape-widget`
- `window.MixtapePlayer.variants` exposes the available presets

## Available UI Toggles

- `showCover`
- `showArtist`
- `showBrand`
- `showAction`
- `showStatus`
- `showWaveform`
- `showShuffle`
- `showPrevNext`
- `showPlay`
- `showRepeat`
- `showTime`
- `showVolume`
- `showMenu`
- `showTracklist`

## Emitted Events

- `trackchange`
- `playstatechange`
- `shufflechange`
- `repeatchange`
- `volumechange`
- `filesdropped`

Each event includes `detail.track`, `detail.trackIndex`, `detail.isPlaying`, `detail.shuffle`, `detail.repeatMode`, and `detail.volume`.
