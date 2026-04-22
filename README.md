# Mixtape Player

Un web player standalone ispirato al layout dello screenshot: nessun framework, nessuna build, un solo file JavaScript da includere in qualsiasi pagina.

## Cosa include

- componente custom element: `<mixtape-player>`
- modalità widget da incollare con uno snippet unico
- supporto a file audio locali caricati dal browser
- drag-and-drop diretto dei file sul player
- supporto a file remoti via URL
- waveform con fallback visivo quando una sorgente remota non espone CORS
- play/pause, previous/next, seek bar, volume, shuffle e repeat
- playlist con selezione tracce
- personalizzazione via opzioni JavaScript e CSS custom properties
- demo pronta in `index.html`

## Avvio rapido

Apri un server statico nella cartella:

```bash
python3 -m http.server 8080
```

Poi visita `http://localhost:8080`.

## Snippet unico

```html
<script
  src="https://tuo-dominio.it/mixtape-player.js"
  data-mixtape-widget
  data-variant="full"
  data-config='{"title":"My Playlist","artist":"Various Artists","tracks":[{"title":"Intro","src":"/audio/intro.mp3"},{"title":"Remote Track","src":"https://example.com/audio/track.ogg"}]}'
></script>
```

Questo snippet crea automaticamente il widget nel punto in cui incolli lo script.

## Variante minimale

```html
<script
  src="https://tuo-dominio.it/mixtape-player.js"
  data-mixtape-widget
  data-variant="minimal"
  data-config='{"title":"Single Track","artist":"Demo","tracks":[{"title":"Intro","src":"/audio/intro.mp3"}]}'
></script>
```

## Preset disponibili

- `full`
  Player completo.
- `minimal`
  Versione essenziale, senza waveform, tracklist e controlli secondari.
- `compact`
  Via di mezzo più leggera, con tracklist e vari elementi secondari nascosti.

Puoi usare `variant` e poi rifinire con i singoli `show*`. I toggle manuali vincono sempre sul preset.

## Uso base

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

## File locali scelti dall’utente

```html
<input id="files" type="file" accept="audio/*" multiple />

<script>
  const player = document.querySelector("#player");

  document.querySelector("#files").addEventListener("change", (event) => {
    player.loadFiles(event.target.files, { append: true });
  });
</script>
```

## Drag-and-drop diretto

Se `allowFileDrop` e `true`, puoi trascinare file audio direttamente sopra il player e verranno aggiunti subito alla playlist.

## Alternativa con JSON inline

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

## Config disponibile

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

## CSS variables utili

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

## API JavaScript

- `element.load(config)` aggiorna tutto il player
- `element.setTheme(theme)` aggiorna le CSS vars del componente
- `element.setTracks(tracks, options)` sostituisce la playlist
- `element.addTracks(tracks, options)` aggiunge nuove tracce
- `element.loadFiles(fileList, options)` aggiunge file locali selezionati dal browser
- `element.play()` avvia la riproduzione
- `element.pause()` mette in pausa
- `window.MixtapePlayer.create(target, config)` crea e monta il componente
- `window.MixtapePlayer.mountFromScript(script)` monta il widget da uno script con `data-mixtape-widget`
- `window.MixtapePlayer.variants` espone i preset disponibili

## Toggle UI disponibili

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

## Eventi emessi

- `trackchange`
- `playstatechange`
- `shufflechange`
- `repeatchange`
- `volumechange`
- `filesdropped`

Ogni evento contiene `detail.track`, `detail.trackIndex`, `detail.isPlaying`, `detail.shuffle`, `detail.repeatMode` e `detail.volume`.
