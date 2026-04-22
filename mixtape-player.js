const MIXTAPE_PLAYER_TEMPLATE = document.createElement("template");

MIXTAPE_PLAYER_TEMPLATE.innerHTML = `
  <style>
    :host {
      --mixtape-bg: #102924;
      --mixtape-panel-bg: #194237;
      --mixtape-list-bg: #0b1e1a;
      --mixtape-text: #f6efdf;
      --mixtape-muted: rgba(236, 227, 208, 0.76);
      --mixtape-border: rgba(255, 255, 255, 0.08);
      --mixtape-accent: #f0d28d;
      --mixtape-accent-strong: #ffd97b;
      --mixtape-shadow: 0 30px 70px rgba(6, 19, 15, 0.32);
      --mixtape-radius: 30px;
      --mixtape-cover-radius: 24px;
      --mixtape-font: "Space Grotesk", "Avenir Next", sans-serif;
      --mixtape-tracklist-max-height: 440px;
      display: block;
      font-family: var(--mixtape-font);
      color: var(--mixtape-text);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    button,
    a,
    input {
      font: inherit;
    }

    [hidden] {
      display: none !important;
    }

    .shell {
      background:
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.09), transparent 34%),
        radial-gradient(circle at bottom right, rgba(8, 20, 17, 0.26), transparent 28%),
        var(--mixtape-bg);
      border-radius: var(--mixtape-radius);
      box-shadow: var(--mixtape-shadow);
      overflow: hidden;
      position: relative;
    }

    .shell[data-dragover="true"] {
      box-shadow:
        0 30px 70px rgba(6, 19, 15, 0.32),
        0 0 0 2px rgba(255, 255, 255, 0.4) inset;
    }

    .drop-overlay {
      position: absolute;
      inset: 16px;
      display: grid;
      place-items: center;
      border-radius: calc(var(--mixtape-radius) - 8px);
      background: rgba(12, 30, 26, 0.68);
      border: 2px dashed rgba(255, 255, 255, 0.42);
      color: var(--mixtape-accent);
      text-align: center;
      padding: 28px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 160ms ease;
      z-index: 3;
      backdrop-filter: blur(10px);
    }

    .drop-overlay[data-visible="true"] {
      opacity: 1;
    }

    .drop-title {
      display: block;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .drop-copy {
      display: block;
      margin-top: 8px;
      color: var(--mixtape-muted);
      font-size: 0.98rem;
      line-height: 1.5;
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(220px, 320px) minmax(0, 1fr);
      gap: 32px;
      align-items: center;
      padding: 42px 46px 36px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(0, 0, 0, 0.08)),
        var(--mixtape-panel-bg);
      position: relative;
    }

    .hero[data-cover-hidden="true"] {
      grid-template-columns: minmax(0, 1fr);
    }

    .brand-link {
      position: absolute;
      top: 28px;
      right: 28px;
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      color: var(--mixtape-panel-bg);
      background: var(--mixtape-accent);
      text-decoration: none;
      box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
    }

    .brand-link[hidden] {
      display: none;
    }

    .cover-wrap {
      min-width: 0;
    }

    .cover {
      width: 100%;
      aspect-ratio: 1 / 1;
      object-fit: cover;
      border-radius: var(--mixtape-cover-radius);
      box-shadow: 0 18px 32px rgba(7, 20, 17, 0.26);
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0.14));
    }

    .cover-caption {
      margin-top: 14px;
      font-size: 0.95rem;
      color: var(--mixtape-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .content {
      min-width: 0;
    }

    .title {
      margin: 0;
      font-size: clamp(2rem, 5vw, 4rem);
      line-height: 0.94;
      letter-spacing: -0.04em;
    }

    .artist {
      margin: 12px 0 0;
      font-size: clamp(1.2rem, 2vw, 1.8rem);
      color: var(--mixtape-muted);
    }

    .action-row {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      align-items: center;
      margin-top: 26px;
    }

    .action {
      display: inline-flex;
      align-items: center;
      gap: 14px;
      color: var(--mixtape-accent);
      text-decoration: none;
      font-size: 1.05rem;
      font-weight: 600;
    }

    .action[hidden] {
      display: none;
    }

    .action-icon {
      width: 44px;
      height: 44px;
      border-radius: 999px;
      border: 2px solid currentColor;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
    }

    .action-icon svg {
      width: 20px;
      height: 20px;
    }

    .status-chip {
      padding: 10px 14px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: var(--mixtape-muted);
      font-size: 0.9rem;
    }

    .waveform-shell {
      position: relative;
      margin-top: 28px;
      padding: 16px 0 6px;
    }

    .waveform {
      width: 100%;
      height: 98px;
      display: block;
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(0, 0, 0, 0.06)),
        rgba(9, 24, 21, 0.22);
    }

    .progress {
      position: absolute;
      inset: 16px 0 6px;
      width: 100%;
      height: calc(100% - 22px);
      appearance: none;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }

    .control-row {
      display: grid;
      grid-template-columns: auto auto auto auto auto auto minmax(160px, 220px) auto;
      gap: 14px;
      align-items: center;
      margin-top: 18px;
    }

    .mini-btn,
    .play-btn,
    .mode-btn,
    .menu-btn {
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--mixtape-accent);
      cursor: pointer;
      padding: 0;
      display: grid;
      place-items: center;
      transition: transform 160ms ease, opacity 160ms ease, background-color 160ms ease;
    }

    .mini-btn:hover,
    .play-btn:hover,
    .mode-btn:hover,
    .menu-btn:hover {
      transform: translateY(-1px);
    }

    .mini-btn {
      width: 38px;
      height: 38px;
    }

    .play-btn {
      width: 88px;
      height: 88px;
      background: var(--mixtape-accent);
      color: var(--mixtape-panel-bg);
      border-radius: 999px;
      box-shadow: 0 18px 30px rgba(6, 19, 15, 0.18);
    }

    .play-btn svg {
      width: 38px;
      height: 38px;
    }

    .mode-btn,
    .menu-btn {
      min-width: 40px;
      height: 40px;
      border-radius: 999px;
      color: var(--mixtape-muted);
      padding: 0 12px;
    }

    .mode-btn[data-active="true"],
    .menu-btn[data-active="true"] {
      background: rgba(255, 255, 255, 0.1);
      color: var(--mixtape-accent);
    }

    .mini-btn svg,
    .mode-btn svg,
    .menu-btn svg {
      width: 24px;
      height: 24px;
    }

    .repeat-label {
      font-size: 0.72rem;
      font-weight: 700;
      margin-left: -4px;
      min-width: 10px;
      text-align: center;
    }

    .time {
      min-width: 110px;
      text-align: left;
      font-size: 1rem;
      color: var(--mixtape-accent);
      font-variant-numeric: tabular-nums;
    }

    .volume-wrap {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      gap: 10px;
      align-items: center;
      min-width: 0;
      padding: 0 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      height: 40px;
    }

    .volume-wrap svg {
      width: 18px;
      height: 18px;
      color: var(--mixtape-muted);
    }

    .volume {
      appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 999px;
      background:
        linear-gradient(90deg, var(--mixtape-accent) var(--volume-progress, 100%), rgba(255, 255, 255, 0.14) var(--volume-progress, 100%));
      outline: none;
      cursor: pointer;
    }

    .volume::-webkit-slider-thumb {
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 999px;
      background: var(--mixtape-accent);
      border: 0;
    }

    .volume::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 999px;
      background: var(--mixtape-accent);
      border: 0;
    }

    .list {
      padding: 10px 0 4px;
      background: var(--mixtape-list-bg);
      border-top: 1px solid var(--mixtape-border);
      max-height: var(--mixtape-tracklist-max-height);
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: thin;
      scrollbar-color: rgba(240, 210, 141, 0.38) rgba(255, 255, 255, 0.06);
    }

    .list::-webkit-scrollbar {
      width: 12px;
    }

    .list::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.04);
      border-radius: 999px;
    }

    .list::-webkit-scrollbar-thumb {
      background: rgba(240, 210, 141, 0.35);
      border-radius: 999px;
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    .list::-webkit-scrollbar-thumb:hover {
      background: rgba(240, 210, 141, 0.52);
      border: 2px solid transparent;
      background-clip: padding-box;
    }

    .track {
      width: 100%;
      appearance: none;
      border: 0;
      display: grid;
      grid-template-columns: 40px minmax(0, 1fr) auto;
      gap: 16px;
      align-items: center;
      padding: 18px 46px;
      background: transparent;
      color: inherit;
      text-align: left;
      cursor: pointer;
      transition: background-color 160ms ease;
    }

    .track:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .track[aria-current="true"] {
      background: rgba(255, 255, 255, 0.07);
    }

    .track-index {
      color: var(--mixtape-muted);
      font-size: 1rem;
      font-variant-numeric: tabular-nums;
    }

    .track-title {
      display: block;
      margin: 0;
      font-size: 1.2rem;
      line-height: 1.2;
    }

    .track-artist {
      display: block;
      margin-top: 6px;
      color: var(--mixtape-muted);
      font-size: 1rem;
      line-height: 1.2;
    }

    .track-duration {
      color: var(--mixtape-accent);
      font-size: 1.05rem;
      font-variant-numeric: tabular-nums;
    }

    .empty {
      padding: 18px 46px 34px;
      color: var(--mixtape-muted);
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    @media (max-width: 1080px) {
      .control-row {
        grid-template-columns: auto auto auto auto auto auto;
      }

      .time {
        grid-column: 1 / span 2;
      }

      .volume-wrap {
        grid-column: 3 / -1;
      }
    }

    @media (max-width: 840px) {
      .hero {
        grid-template-columns: 1fr;
        padding: 28px 22px 24px;
        gap: 22px;
      }

      .cover-wrap {
        max-width: 320px;
      }

      .play-btn {
        width: 72px;
        height: 72px;
      }

      .play-btn svg {
        width: 32px;
        height: 32px;
      }

      .control-row {
        grid-template-columns: repeat(4, minmax(0, auto));
      }

      .time {
        grid-column: 1 / -1;
        order: 10;
      }

      .volume-wrap {
        grid-column: 1 / -1;
      }

      .track {
        padding: 16px 22px;
        grid-template-columns: 28px minmax(0, 1fr) auto;
      }

      .list {
        max-height: min(52vh, var(--mixtape-tracklist-max-height));
      }
    }
  </style>

  <section class="shell">
    <div class="drop-overlay" aria-hidden="true" data-visible="false">
      <div>
        <span class="drop-title"></span>
        <span class="drop-copy">Drop audio files to add them to the playlist instantly.</span>
      </div>
    </div>

    <div class="hero">
      <a class="brand-link" part="brand-link" target="_blank" rel="noreferrer noopener" hidden></a>

      <div class="cover-wrap">
        <img class="cover" part="cover" alt="" />
        <div class="cover-caption" part="cover-caption"></div>
      </div>

      <div class="content">
        <h2 class="title" part="title"></h2>
        <p class="artist" part="artist"></p>

        <div class="action-row">
          <a class="action" part="action" target="_blank" rel="noreferrer noopener" hidden>
            <span class="action-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
              </svg>
            </span>
            <span class="action-label"></span>
          </a>
          <span class="status-chip" part="status"></span>
        </div>

        <div class="waveform-shell">
          <canvas class="waveform" part="waveform"></canvas>
          <label class="sr-only" for="player-progress">Seek track</label>
          <input id="player-progress" class="progress" type="range" min="0" max="1000" value="0" step="1" />
        </div>

        <div class="control-row">
          <button class="mode-btn shuffle-btn" type="button" aria-label="Toggle shuffle" data-active="false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M17 4h3v3M17 20h3v-3M4 7h4l8 10h4M4 17h4l2.2-2.7M14 9.7 16 7h4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <button class="mini-btn prev-btn" type="button" aria-label="Previous track">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 5.5a1 1 0 0 1 1 1V11l8.2-5.1a1 1 0 0 1 1.53.85v10.52a1 1 0 0 1-1.53.85L8 13v4.5a1 1 0 0 1-2 0v-11a1 1 0 0 1 1-1Z" />
            </svg>
          </button>

          <button class="play-btn" type="button" aria-label="Play"></button>

          <button class="mini-btn next-btn" type="button" aria-label="Next track">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 5.5a1 1 0 0 0-1 1V11L7.8 5.9a1 1 0 0 0-1.53.85v10.52a1 1 0 0 0 1.53.85L16 13v4.5a1 1 0 0 0 2 0v-11a1 1 0 0 0-1-1Z" />
            </svg>
          </button>

          <button class="mode-btn repeat-btn" type="button" aria-label="Repeat mode" data-active="false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7h13.5L15 4.5M20 17H6.5L9 19.5M20 7v4M4 17v-4" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="repeat-label"> </span>
          </button>

          <div class="time" part="time">00:00 / 00:00</div>

          <label class="volume-wrap">
            <span aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 10h3l4-4v12l-4-4H5zM16 9a5 5 0 0 1 0 6M18.5 6.5a8.5 8.5 0 0 1 0 11" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <span class="sr-only">Volume</span>
            <input class="volume" type="range" min="0" max="1" step="0.01" value="1" />
          </label>

          <button class="menu-btn" type="button" aria-label="Playlist overview">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.8"></circle>
              <circle cx="12" cy="12" r="1.8"></circle>
              <circle cx="19" cy="12" r="1.8"></circle>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="list" part="track-list">
      <div class="tracks"></div>
      <div class="empty" hidden>No tracks loaded.</div>
    </div>
  </section>
`;

const DEFAULT_BRAND_ICON = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="currentColor"></circle>
    <path d="M7.5 14.5h2v-5h-2zM11 16.2h2V7.8h-2zM14.5 13.3h2v-2.6h-2z" fill="#fff"></path>
  </svg>
`;

const PLAY_ICON = `
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8.6 5.2a1 1 0 0 1 1.55-.83l8.12 5.81a1 1 0 0 1 0 1.64l-8.12 5.81A1 1 0 0 1 8.6 16.8V5.2Z"></path>
  </svg>
`;

const PAUSE_ICON = `
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="7" y="5" width="3.5" height="14" rx="1"></rect>
    <rect x="13.5" y="5" width="3.5" height="14" rx="1"></rect>
  </svg>
`;

const DEFAULT_CONFIG = {
  variant: "full",
  title: "Untitled Playlist",
  artist: "Unknown Artist",
  cover: "",
  coverCaption: "",
  actionLabel: "",
  actionHref: "",
  brandHref: "",
  brandIcon: "",
  autoplay: false,
  initialTrack: 0,
  shuffle: false,
  repeatMode: "off",
  volume: 1,
  allowFileDrop: true,
  replaceOnDrop: false,
  dropLabel: "Drop audio files here",
  autoScrollActiveTrack: true,
  tracklistMaxHeight: "",
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
  tracks: [],
  theme: {},
};

const VARIANT_PRESETS = {
  full: {},
  minimal: {
    showWaveform: false,
    showTracklist: false,
    showShuffle: false,
    showRepeat: false,
    showVolume: false,
    showMenu: false,
    showBrand: false,
    showAction: false,
  },
  compact: {
    showTracklist: false,
    showBrand: false,
    showAction: false,
    showStatus: false,
    showShuffle: false,
    showMenu: false,
  },
};

class MixtapePlayerElement extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(MIXTAPE_PLAYER_TEMPLATE.content.cloneNode(true));

    this.audio = new Audio();
    this.audio.preload = "metadata";

    this.config = { ...DEFAULT_CONFIG };
    this.currentTrackIndex = 0;
    this.isReady = false;
    this.isPlaying = false;
    this.userScrubbing = false;
    this.hasConnected = false;
    this.shuffleEnabled = false;
    this.repeatMode = "off";
    this.shuffleHistory = [];
    this.currentWaveform = createSeededWaveform("empty");
    this.waveformRequestId = 0;
    this.managedObjectUrls = new Set();
    this.dragDepth = 0;

    this.refs = {
      shell: this.shadowRoot.querySelector(".shell"),
      hero: this.shadowRoot.querySelector(".hero"),
      title: this.shadowRoot.querySelector(".title"),
      artist: this.shadowRoot.querySelector(".artist"),
      coverWrap: this.shadowRoot.querySelector(".cover-wrap"),
      cover: this.shadowRoot.querySelector(".cover"),
      coverCaption: this.shadowRoot.querySelector(".cover-caption"),
      actionRow: this.shadowRoot.querySelector(".action-row"),
      action: this.shadowRoot.querySelector(".action"),
      actionLabel: this.shadowRoot.querySelector(".action-label"),
      status: this.shadowRoot.querySelector(".status-chip"),
      brandLink: this.shadowRoot.querySelector(".brand-link"),
      dropOverlay: this.shadowRoot.querySelector(".drop-overlay"),
      dropTitle: this.shadowRoot.querySelector(".drop-title"),
      waveformShell: this.shadowRoot.querySelector(".waveform-shell"),
      waveform: this.shadowRoot.querySelector(".waveform"),
      controlRow: this.shadowRoot.querySelector(".control-row"),
      time: this.shadowRoot.querySelector(".time"),
      progress: this.shadowRoot.querySelector(".progress"),
      playBtn: this.shadowRoot.querySelector(".play-btn"),
      prevBtn: this.shadowRoot.querySelector(".prev-btn"),
      nextBtn: this.shadowRoot.querySelector(".next-btn"),
      shuffleBtn: this.shadowRoot.querySelector(".shuffle-btn"),
      repeatBtn: this.shadowRoot.querySelector(".repeat-btn"),
      repeatLabel: this.shadowRoot.querySelector(".repeat-label"),
      volumeWrap: this.shadowRoot.querySelector(".volume-wrap"),
      volume: this.shadowRoot.querySelector(".volume"),
      menuBtn: this.shadowRoot.querySelector(".menu-btn"),
      list: this.shadowRoot.querySelector(".list"),
      tracks: this.shadowRoot.querySelector(".tracks"),
      empty: this.shadowRoot.querySelector(".empty"),
    };

    this.resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(() => this.drawWaveform()) : null;
  }

  connectedCallback() {
    if (this.hasConnected) {
      return;
    }

    this.hasConnected = true;
    this.bindEvents();
    this.renderPlayButton();
    this.updateProgress();
    this.updateVolumeControl();
    this.updateModeButtons();

    if (this.resizeObserver) {
      this.resizeObserver.observe(this.refs.waveform);
    } else {
      this.boundWindowResize = () => this.drawWaveform();
      window.addEventListener("resize", this.boundWindowResize);
    }

    const inlineConfig = this.querySelector('script[type="application/json"]');
    if (inlineConfig && !this.isReady) {
      try {
        const parsed = JSON.parse(inlineConfig.textContent || "{}");
        this.load(parsed);
      } catch (error) {
        console.error("Invalid mixtape player JSON config.", error);
      }
    } else {
      this.render();
    }
  }

  disconnectedCallback() {
    this.audio.pause();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    } else if (this.boundWindowResize) {
      window.removeEventListener("resize", this.boundWindowResize);
    }
    this.cleanupObjectUrls();
  }

  bindEvents() {
    this.refs.playBtn.addEventListener("click", () => this.togglePlayback());
    this.refs.prevBtn.addEventListener("click", () => this.playPrevious());
    this.refs.nextBtn.addEventListener("click", () => this.playNext({ autoplay: true }));
    this.refs.shuffleBtn.addEventListener("click", () => {
      this.shuffleEnabled = !this.shuffleEnabled;
      if (!this.shuffleEnabled) {
        this.shuffleHistory = [];
      }
      this.updateModeButtons();
      this.emitState("shufflechange");
    });
    this.refs.repeatBtn.addEventListener("click", () => {
      this.repeatMode = nextRepeatMode(this.repeatMode);
      this.updateModeButtons();
      this.emitState("repeatchange");
    });
    this.refs.menuBtn.addEventListener("click", () => {
      this.scrollActiveTrackIntoView({ behavior: "smooth" });
    });

    this.addEventListener("dragenter", (event) => {
      if (!this.config.allowFileDrop || !hasAudioFiles(event)) {
        return;
      }
      event.preventDefault();
      this.dragDepth += 1;
      this.setDropState(true);
    });

    this.addEventListener("dragover", (event) => {
      if (!this.config.allowFileDrop || !hasAudioFiles(event)) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
      this.setDropState(true);
    });

    this.addEventListener("dragleave", (event) => {
      if (!this.config.allowFileDrop) {
        return;
      }
      event.preventDefault();
      this.dragDepth = Math.max(0, this.dragDepth - 1);
      if (this.dragDepth === 0) {
        this.setDropState(false);
      }
    });

    this.addEventListener("drop", (event) => {
      if (!this.config.allowFileDrop) {
        return;
      }
      event.preventDefault();
      this.dragDepth = 0;
      this.setDropState(false);
      if (!hasAudioFiles(event)) {
        return;
      }
      const files = Array.from(event.dataTransfer.files || []);
      if (files.length === 0) {
        return;
      }
      const shouldAppend = !this.config.replaceOnDrop && this.config.tracks.length > 0;
      this.loadFiles(files, {
        append: shouldAppend,
        autoplay: this.config.tracks.length === 0,
        playNew: !shouldAppend,
      });
      this.emitState("filesdropped");
    });

    this.refs.progress.addEventListener("input", (event) => {
      this.userScrubbing = true;
      const value = Number(event.target.value);
      const duration = this.audio.duration || 0;
      const nextTime = duration * (value / 1000);
      this.updateProgressVisual(value / 10);
      this.refs.time.textContent = `${formatTime(nextTime)} / ${formatTime(duration)}`;
    });

    this.refs.progress.addEventListener("change", (event) => {
      const duration = this.audio.duration || 0;
      const value = Number(event.target.value);
      if (duration > 0) {
        this.audio.currentTime = duration * (value / 1000);
      }
      this.userScrubbing = false;
      this.updateProgress();
    });

    this.refs.volume.addEventListener("input", (event) => {
      this.audio.volume = Number(event.target.value);
      this.config.volume = this.audio.volume;
      this.updateVolumeControl();
      this.emitState("volumechange");
    });

    this.audio.addEventListener("loadedmetadata", () => {
      const track = this.getCurrentTrack();
      if (track) {
        track.computedDuration = this.audio.duration;
      }
      this.updateProgress();
      this.renderTracks();
    });

    this.audio.addEventListener("timeupdate", () => {
      if (!this.userScrubbing) {
        this.updateProgress();
      }
    });

    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      this.renderPlayButton();
      this.emitState("playstatechange");
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      this.renderPlayButton();
      this.emitState("playstatechange");
    });

    this.audio.addEventListener("ended", () => {
      if (this.repeatMode === "one") {
        this.audio.currentTime = 0;
        this.play();
        return;
      }
      this.playNext({ autoplay: true, fromEnded: true });
    });
  }

  load(nextConfig = {}) {
    this.cleanupObjectUrls();

    const variant = sanitizeVariant(nextConfig.variant);
    const variantPreset = VARIANT_PRESETS[variant];
    const merged = {
      ...DEFAULT_CONFIG,
      ...variantPreset,
      ...nextConfig,
      variant,
      actionLabel: nextConfig.actionLabel || nextConfig.ctaLabel || "",
      actionHref: nextConfig.actionHref || nextConfig.ctaHref || "",
      theme: {
        ...DEFAULT_CONFIG.theme,
        ...(nextConfig.theme || {}),
      },
    };

    merged.tracks = Array.isArray(nextConfig.tracks)
      ? nextConfig.tracks.map((track) => this.normalizeTrack(track, merged.artist))
      : [];

    this.config = merged;
    this.shuffleEnabled = !!merged.shuffle;
    this.repeatMode = sanitizeRepeatMode(merged.repeatMode);
    this.shuffleHistory = [];
    this.audio.volume = clampVolume(merged.volume);

    this.applyTheme(this.config.theme);
    this.applyConfigStyles();
    this.currentTrackIndex = clampIndex(this.config.initialTrack, this.config.tracks.length);
    this.isReady = true;
    this.render();

    if (this.config.tracks.length > 0) {
      this.loadTrack(this.currentTrackIndex, { autoplay: !!this.config.autoplay });
    } else {
      this.audio.removeAttribute("src");
      this.audio.load();
      this.currentWaveform = createSeededWaveform("empty");
      this.updateProgress();
      this.drawWaveform();
    }

    return this;
  }

  setTheme(theme = {}) {
    this.applyTheme(theme);
    this.config.theme = { ...this.config.theme, ...theme };
    this.applyConfigStyles();
  }

  setTracks(tracks = [], options = {}) {
    this.cleanupObjectUrls();
    this.config.tracks = Array.isArray(tracks)
      ? tracks.map((track) => this.normalizeTrack(track, this.config.artist))
      : [];
    this.currentTrackIndex = clampIndex(0, this.config.tracks.length);
    this.shuffleHistory = [];
    this.render();

    if (this.config.tracks.length > 0) {
      this.loadTrack(this.currentTrackIndex, { autoplay: !!options.autoplay });
    } else {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
      this.currentWaveform = createSeededWaveform("empty");
      this.updateProgress();
      this.drawWaveform();
    }
  }

  addTracks(tracks = [], options = {}) {
    const normalizedTracks = Array.isArray(tracks)
      ? tracks.map((track) => this.normalizeTrack(track, this.config.artist))
      : [];
    const startLength = this.config.tracks.length;
    this.config.tracks.push(...normalizedTracks);
    this.renderTracks();

    if (startLength === 0 && this.config.tracks.length > 0) {
      this.loadTrack(0, { autoplay: !!options.autoplay });
      return;
    }

    if (options.playNew && normalizedTracks.length > 0) {
      this.loadTrack(startLength, { autoplay: true });
    }
  }

  loadFiles(files, options = {}) {
    const nextTracks = Array.from(files || [])
      .filter((file) => String(file.type || "").startsWith("audio/") || /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name))
      .map((file) =>
        this.normalizeTrack({
          title: stripExtension(file.name),
          artist: options.artist || this.config.artist,
          file,
        }, options.artist || this.config.artist)
      );

    if (options.append !== false) {
      this.addTracks(nextTracks, { autoplay: !!options.autoplay, playNew: !!options.playNew });
    } else {
      this.setTracks(nextTracks, { autoplay: !!options.autoplay });
    }

    return nextTracks;
  }

  play() {
    if (!this.getCurrentTrack()) {
      return;
    }

    this.audio.play().catch((error) => {
      console.warn("Playback could not start automatically.", error);
    });
  }

  pause() {
    this.audio.pause();
  }

  togglePlayback() {
    if (this.audio.src) {
      if (this.audio.paused) {
        this.play();
      } else {
        this.pause();
      }
      return;
    }

    if (this.config.tracks.length > 0) {
      this.loadTrack(this.currentTrackIndex, { autoplay: true });
    }
  }

  playPrevious() {
    if (this.config.tracks.length === 0) {
      return;
    }

    if (this.shuffleEnabled && this.shuffleHistory.length > 0) {
      const previousIndex = this.shuffleHistory.pop();
      this.loadTrack(previousIndex, { autoplay: true, preserveHistory: true });
      return;
    }

    const targetIndex = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : this.config.tracks.length - 1;
    this.loadTrack(targetIndex, { autoplay: true });
  }

  playNext(options = {}) {
    const length = this.config.tracks.length;
    if (length === 0) {
      return;
    }

    const nextIndex = this.getNextTrackIndex(options.fromEnded);
    if (nextIndex == null) {
      this.pause();
      return;
    }

    this.loadTrack(nextIndex, { autoplay: options.autoplay !== false });
  }

  getNextTrackIndex(fromEnded = false) {
    const length = this.config.tracks.length;
    if (length === 0) {
      return null;
    }

    if (this.shuffleEnabled && length > 1) {
      this.shuffleHistory.push(this.currentTrackIndex);
      return getRandomTrackIndex(length, this.currentTrackIndex);
    }

    const nextIndex = this.currentTrackIndex + 1;
    if (nextIndex < length) {
      return nextIndex;
    }

    if (this.repeatMode === "all") {
      return 0;
    }

    return fromEnded ? null : 0;
  }

  loadTrack(index, options = {}) {
    const track = this.config.tracks[index];
    if (!track) {
      return;
    }

    if (!options.preserveHistory && !this.shuffleEnabled) {
      this.shuffleHistory = [];
    }

    this.currentTrackIndex = index;

    if (track.src) {
      if (this.audio.src !== track.src) {
        this.audio.src = track.src;
      }
      this.audio.load();
      if (options.autoplay) {
        this.play();
      } else {
        this.pause();
      }
    } else {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
    }

    this.render();
    this.updateProgress();
    this.loadWaveformForTrack(track);
    this.emitState("trackchange");
  }

  normalizeTrack(track = {}, fallbackArtist = this.config.artist) {
    const normalized = { ...track };

    if (track.file instanceof File) {
      normalized.file = track.file;
      normalized.src = URL.createObjectURL(track.file);
      normalized.__objectUrl = normalized.src;
      this.managedObjectUrls.add(normalized.src);
    }

    normalized.title = normalized.title || inferTrackTitle(normalized.src || normalized.file?.name || "");
    normalized.artist = normalized.artist || fallbackArtist || DEFAULT_CONFIG.artist;

    return normalized;
  }

  cleanupObjectUrls() {
    this.managedObjectUrls.forEach((url) => URL.revokeObjectURL(url));
    this.managedObjectUrls.clear();
  }

  applyTheme(theme) {
    Object.entries(theme || {}).forEach(([key, value]) => {
      const variableName = key.startsWith("--") ? key : `--${key}`;
      this.style.setProperty(variableName, value);
    });
  }

  applyConfigStyles() {
    const tracklistMaxHeight = normalizeCssSize(this.config.tracklistMaxHeight);
    if (tracklistMaxHeight) {
      this.style.setProperty("--mixtape-tracklist-max-height", tracklistMaxHeight);
    } else {
      this.style.removeProperty("--mixtape-tracklist-max-height");
    }
  }

  getCurrentTrack() {
    return this.config.tracks[this.currentTrackIndex] || null;
  }

  emitState(name) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          player: this,
          track: this.getCurrentTrack(),
          trackIndex: this.currentTrackIndex,
          isPlaying: this.isPlaying,
          shuffle: this.shuffleEnabled,
          repeatMode: this.repeatMode,
          volume: this.audio.volume,
        },
      })
    );
  }

  render() {
    const currentTrack = this.getCurrentTrack();

    this.refs.title.textContent = this.config.title || currentTrack?.title || DEFAULT_CONFIG.title;
    this.refs.artist.textContent = currentTrack?.artist || this.config.artist || DEFAULT_CONFIG.artist;
    this.refs.cover.src = this.config.cover || currentTrack?.cover || createFallbackCover(this.config.title, this.config.artist);
    this.refs.cover.alt = `${this.config.title || "Playlist"} cover`;
    this.refs.coverCaption.textContent = this.config.coverCaption || currentTrack?.artist || this.config.artist || "";

    this.refs.action.hidden = !(this.config.actionLabel && this.config.actionHref);
    this.refs.actionLabel.textContent = this.config.actionLabel || "";
    if (this.config.actionHref) {
      this.refs.action.href = this.config.actionHref;
    } else {
      this.refs.action.removeAttribute("href");
    }

    this.refs.status.textContent = currentTrack
      ? `${this.currentTrackIndex + 1}/${this.config.tracks.length} · ${currentTrack.title || "Track"}`
      : "Ready for local files or remote URLs";
    this.refs.dropTitle.textContent = this.config.dropLabel || DEFAULT_CONFIG.dropLabel;

    this.refs.brandLink.hidden = !this.config.brandHref;
    if (this.config.brandHref) {
      this.refs.brandLink.href = this.config.brandHref;
      this.refs.brandLink.innerHTML = this.config.brandIcon || DEFAULT_BRAND_ICON;
      this.refs.brandLink.setAttribute("aria-label", "Open external link");
    } else {
      this.refs.brandLink.innerHTML = "";
      this.refs.brandLink.removeAttribute("href");
    }

    this.renderTracks();
    this.renderPlayButton();
    this.updateModeButtons();
    this.updateVolumeControl();
    this.renderVisibility();
    this.updateProgress();
  }

  renderTracks() {
    const tracks = this.config.tracks;
    this.refs.tracks.replaceChildren();
    this.refs.empty.hidden = tracks.length > 0;

    tracks.forEach((track, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "track";
      button.setAttribute("aria-current", String(index === this.currentTrackIndex));

      const title = track.title || `Track ${index + 1}`;
      const artist = track.artist || this.config.artist || DEFAULT_CONFIG.artist;
      const duration = track.duration || track.computedDuration || 0;

      button.innerHTML = `
        <span class="track-index">${String(index + 1).padStart(2, "0")}</span>
        <span>
          <span class="track-title">${escapeHtml(title)}</span>
          <span class="track-artist">${escapeHtml(artist)}</span>
        </span>
        <span class="track-duration">${formatDurationValue(duration)}</span>
      `;

      button.addEventListener("click", () => {
        this.loadTrack(index, { autoplay: true });
      });

      this.refs.tracks.appendChild(button);
    });

    if (this.config.autoScrollActiveTrack) {
      this.scrollActiveTrackIntoView();
    }
  }

  scrollActiveTrackIntoView(options = {}) {
    if (!this.config.showTracklist) {
      return;
    }

    const activeTrack = this.refs.tracks.querySelector('[aria-current="true"]');
    if (!activeTrack) {
      return;
    }

    const behavior = options.behavior || "auto";
    requestAnimationFrame(() => {
      activeTrack.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior,
      });
    });
  }

  renderPlayButton() {
    this.refs.playBtn.innerHTML = this.isPlaying ? PAUSE_ICON : PLAY_ICON;
    this.refs.playBtn.setAttribute("aria-label", this.isPlaying ? "Pause" : "Play");
  }

  updateModeButtons() {
    this.refs.shuffleBtn.dataset.active = String(this.shuffleEnabled);
    this.refs.repeatBtn.dataset.active = String(this.repeatMode !== "off");
    this.refs.repeatLabel.textContent = this.repeatMode === "one" ? "1" : " ";
  }

  updateVolumeControl() {
    const currentVolume = Number.isFinite(this.audio.volume) ? this.audio.volume : this.config.volume;
    const safeVolume = clampVolume(currentVolume);
    const percent = safeVolume * 100;
    this.refs.volume.value = String(safeVolume);
    this.refs.volume.style.setProperty("--volume-progress", `${percent}%`);
  }

  updateProgress() {
    const duration = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    const currentTime = Number.isFinite(this.audio.currentTime) ? this.audio.currentTime : 0;
    const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

    this.refs.progress.value = String(Math.round(percent * 10));
    this.updateProgressVisual(percent);
    this.refs.time.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }

  updateProgressVisual(percent) {
    this.refs.progress.style.setProperty("--progress", `${percent}%`);
    this.drawWaveform(percent);
  }

  async loadWaveformForTrack(track) {
    const requestId = ++this.waveformRequestId;

    if (Array.isArray(track.waveform) && track.waveform.length > 0) {
      this.currentWaveform = track.waveform;
      this.drawWaveform();
      return;
    }

    this.currentWaveform = createSeededWaveform(track.title || track.src || "track");
    this.drawWaveform();

    try {
      const bars = await extractWaveformData(track);
      if (this.waveformRequestId !== requestId) {
        return;
      }
      track.waveform = bars;
      this.currentWaveform = bars;
    } catch (error) {
      if (this.waveformRequestId !== requestId) {
        return;
      }
      this.currentWaveform = createSeededWaveform(track.title || track.src || "track");
    }

    this.drawWaveform();
  }

  drawWaveform(forcedProgressPercent) {
    const canvas = this.refs.waveform;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(rect.width * ratio);
    const height = Math.round(rect.height * ratio);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.scale(ratio, ratio);

    const bars = this.currentWaveform || createSeededWaveform("fallback");
    const progressPercent =
      typeof forcedProgressPercent === "number"
        ? forcedProgressPercent
        : this.audio.duration > 0
          ? (this.audio.currentTime / this.audio.duration) * 100
          : 0;

    const css = getComputedStyle(this);
    const activeColor = css.getPropertyValue("--mixtape-accent").trim() || "#ffffff";
    const inactiveColor = "rgba(255, 255, 255, 0.18)";
    const centerY = rect.height / 2;
    const count = bars.length;
    const gap = 3;
    const barWidth = Math.max(2, (rect.width - gap * (count - 1)) / count);

    bars.forEach((bar, index) => {
      const x = index * (barWidth + gap);
      const normalized = Math.max(0.12, Math.min(1, bar));
      const barHeight = Math.max(8, normalized * (rect.height * 0.84));
      const y = centerY - barHeight / 2;
      const played = ((index + 1) / count) * 100 <= progressPercent;
      ctx.fillStyle = played ? activeColor : inactiveColor;
      roundRect(ctx, x, y, barWidth, barHeight, Math.min(barWidth / 2, 4));
      ctx.fill();
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  setDropState(isActive) {
    this.refs.shell.dataset.dragover = String(isActive);
    this.refs.dropOverlay.dataset.visible = String(isActive);
  }

  renderVisibility() {
    const showActionLink = this.config.showAction && !!(this.config.actionLabel && this.config.actionHref);
    const showStatus = this.config.showStatus;
    const showBrand = this.config.showBrand && !!this.config.brandHref;

    this.refs.coverWrap.hidden = !this.config.showCover;
    this.refs.hero.dataset.coverHidden = String(!this.config.showCover);
    this.refs.artist.hidden = !this.config.showArtist;
    this.refs.brandLink.hidden = !showBrand;
    this.refs.action.hidden = !showActionLink;
    this.refs.status.hidden = !showStatus;
    this.refs.actionRow.hidden = !(showActionLink || showStatus);
    this.refs.waveformShell.hidden = !this.config.showWaveform;
    this.refs.shuffleBtn.hidden = !this.config.showShuffle;
    this.refs.prevBtn.hidden = !this.config.showPrevNext;
    this.refs.nextBtn.hidden = !this.config.showPrevNext;
    this.refs.playBtn.hidden = !this.config.showPlay;
    this.refs.repeatBtn.hidden = !this.config.showRepeat;
    this.refs.time.hidden = !this.config.showTime;
    this.refs.volumeWrap.hidden = !this.config.showVolume;
    this.refs.menuBtn.hidden = !(this.config.showMenu && this.config.showTracklist);
    this.refs.list.hidden = !this.config.showTracklist;
    this.refs.controlRow.hidden = !(
      this.config.showShuffle ||
      this.config.showPrevNext ||
      this.config.showPlay ||
      this.config.showRepeat ||
      this.config.showTime ||
      this.config.showVolume ||
      this.config.showMenu
    );

    this.refs.dropOverlay.hidden = !this.config.allowFileDrop;
  }
}

function clampIndex(index, length) {
  if (length === 0) {
    return 0;
  }
  return Math.max(0, Math.min(index || 0, length - 1));
}

function clampVolume(value) {
  return Math.max(0, Math.min(1, Number(value)));
}

function sanitizeRepeatMode(mode) {
  return ["off", "all", "one"].includes(mode) ? mode : "off";
}

function sanitizeVariant(variant) {
  return Object.hasOwn(VARIANT_PRESETS, variant) ? variant : "full";
}

function nextRepeatMode(mode) {
  if (mode === "off") {
    return "all";
  }
  if (mode === "all") {
    return "one";
  }
  return "off";
}

function formatTime(value) {
  if (!value || !Number.isFinite(value)) {
    return "00:00";
  }

  const totalSeconds = Math.max(0, Math.floor(value));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDurationValue(value) {
  if (typeof value === "string") {
    return value;
  }
  return formatTime(Number(value) || 0);
}

function inferTrackTitle(source) {
  if (!source) {
    return "Untitled Track";
  }

  try {
    const url = new URL(source, window.location.href);
    const fileName = url.pathname.split("/").pop() || source;
    return stripExtension(decodeURIComponent(fileName));
  } catch {
    return stripExtension(String(source).split("/").pop() || String(source));
  }
}

function stripExtension(value) {
  return String(value).replace(/\.[^/.]+$/, "");
}

function getRandomTrackIndex(length, currentIndex) {
  if (length <= 1) {
    return currentIndex;
  }

  let nextIndex = currentIndex;
  while (nextIndex === currentIndex) {
    nextIndex = Math.floor(Math.random() * length);
  }
  return nextIndex;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createFallbackCover(title, artist) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f7efdc" />
          <stop offset="100%" stop-color="#ebdcc0" />
        </linearGradient>
      </defs>
      <rect width="900" height="900" rx="92" fill="url(#bg)" />
      <rect x="132" y="170" width="636" height="560" rx="34" fill="#17362f" />
      <rect x="132" y="170" width="320" height="560" rx="34" fill="#21453b" />
      <circle cx="606" cy="304" r="94" fill="#efca74" />
      <circle cx="606" cy="304" r="34" fill="#f7efdc" />
      <path d="M216 604C296 554 377 550 454 572C530 594 575 630 664 630" fill="none" stroke="#f7efdc" stroke-width="16" stroke-linecap="round" />
      <path d="M216 556C286 520 363 510 446 526C526 542 584 576 684 576" fill="none" stroke="#efca74" stroke-width="10" stroke-linecap="round" />
      <text x="450" y="294" font-family="Arial, sans-serif" font-size="42" text-anchor="middle" fill="#173a31">${escapeHtml(
        title || "Mixtape"
      )}</text>
      <text x="450" y="340" font-family="Arial, sans-serif" font-size="28" text-anchor="middle" fill="#556760">${escapeHtml(
        artist || "Artist"
      )}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createSeededWaveform(seed) {
  const hash = hashString(seed);
  const bars = [];
  for (let index = 0; index < 72; index += 1) {
    const value = Math.abs(Math.sin((hash + index * 31) * 0.017) * Math.cos((hash + index * 13) * 0.011));
    bars.push(0.16 + value * 0.84);
  }
  return bars;
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) + 1;
}

async function extractWaveformData(track) {
  const arrayBuffer = track.file instanceof File ? await track.file.arrayBuffer() : await fetchTrackBuffer(track.src);
  const audioContext = getWaveformAudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
  return sampleWaveform(audioBuffer.getChannelData(0), 72);
}

async function fetchTrackBuffer(src) {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`Unable to fetch audio file: ${response.status}`);
  }
  return response.arrayBuffer();
}

function sampleWaveform(channelData, barCount) {
  const blockSize = Math.floor(channelData.length / barCount) || 1;
  const bars = [];

  for (let index = 0; index < barCount; index += 1) {
    const start = index * blockSize;
    const end = Math.min(start + blockSize, channelData.length);
    let peak = 0;

    for (let cursor = start; cursor < end; cursor += 1) {
      const sample = Math.abs(channelData[cursor]);
      if (sample > peak) {
        peak = sample;
      }
    }

    bars.push(peak);
  }

  const max = Math.max(...bars, 0.001);
  return bars.map((value) => Math.max(0.12, value / max));
}

let waveformAudioContext;

function getWaveformAudioContext() {
  if (!waveformAudioContext) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    waveformAudioContext = new AudioContextCtor();
  }
  return waveformAudioContext;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function hasAudioFiles(event) {
  const items = Array.from(event.dataTransfer?.items || []);
  if (items.length > 0) {
    return items.some((item) => item.kind === "file" && (String(item.type || "").startsWith("audio/") || item.type === ""));
  }
  return Array.from(event.dataTransfer?.files || []).some((file) => String(file.type || "").startsWith("audio/"));
}

function parseJSONAttribute(value, fallback) {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(value));
    } catch {
      return fallback;
    }
  }
}

function parseBooleanAttribute(value, fallback = false) {
  if (value == null || value === "") {
    return fallback;
  }
  return !["false", "0", "no", "off"].includes(String(value).toLowerCase());
}

function parseNumberAttribute(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCssSize(value) {
  if (value == null || value === "") {
    return "";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return `${value}px`;
  }

  const stringValue = String(value).trim();
  if (!stringValue) {
    return "";
  }

  if (/^\d+(\.\d+)?$/.test(stringValue)) {
    return `${stringValue}px`;
  }

  return stringValue;
}

function buildConfigFromScriptTag(script) {
  const config = parseJSONAttribute(script.dataset.config, {}) || {};
  const tracks = parseJSONAttribute(script.dataset.tracks, config.tracks);
  const theme = parseJSONAttribute(script.dataset.theme, config.theme);
  const variant = script.dataset.variant ?? config.variant;

  return {
    ...config,
    variant,
    title: script.dataset.title ?? config.title,
    artist: script.dataset.artist ?? config.artist,
    cover: script.dataset.cover ?? config.cover,
    coverCaption: script.dataset.coverCaption ?? config.coverCaption,
    actionLabel: script.dataset.actionLabel ?? config.actionLabel,
    actionHref: script.dataset.actionHref ?? config.actionHref,
    brandHref: script.dataset.brandHref ?? config.brandHref,
    autoplay: parseBooleanAttribute(script.dataset.autoplay, config.autoplay),
    shuffle: parseBooleanAttribute(script.dataset.shuffle, config.shuffle),
    allowFileDrop: parseBooleanAttribute(script.dataset.allowFileDrop, config.allowFileDrop ?? true),
    replaceOnDrop: parseBooleanAttribute(script.dataset.replaceOnDrop, config.replaceOnDrop),
    autoScrollActiveTrack: parseBooleanAttribute(script.dataset.autoScrollActiveTrack, config.autoScrollActiveTrack ?? true),
    showCover: parseBooleanAttribute(script.dataset.showCover, config.showCover ?? true),
    showArtist: parseBooleanAttribute(script.dataset.showArtist, config.showArtist ?? true),
    showBrand: parseBooleanAttribute(script.dataset.showBrand, config.showBrand ?? true),
    showAction: parseBooleanAttribute(script.dataset.showAction, config.showAction ?? true),
    showStatus: parseBooleanAttribute(script.dataset.showStatus, config.showStatus ?? true),
    showWaveform: parseBooleanAttribute(script.dataset.showWaveform, config.showWaveform ?? true),
    showShuffle: parseBooleanAttribute(script.dataset.showShuffle, config.showShuffle ?? true),
    showPrevNext: parseBooleanAttribute(script.dataset.showPrevNext, config.showPrevNext ?? true),
    showPlay: parseBooleanAttribute(script.dataset.showPlay, config.showPlay ?? true),
    showRepeat: parseBooleanAttribute(script.dataset.showRepeat, config.showRepeat ?? true),
    showTime: parseBooleanAttribute(script.dataset.showTime, config.showTime ?? true),
    showVolume: parseBooleanAttribute(script.dataset.showVolume, config.showVolume ?? true),
    showMenu: parseBooleanAttribute(script.dataset.showMenu, config.showMenu ?? true),
    showTracklist: parseBooleanAttribute(script.dataset.showTracklist, config.showTracklist ?? true),
    initialTrack: parseNumberAttribute(script.dataset.initialTrack, config.initialTrack ?? 0),
    volume: parseNumberAttribute(script.dataset.volume, config.volume ?? 1),
    repeatMode: script.dataset.repeatMode ?? config.repeatMode,
    dropLabel: script.dataset.dropLabel ?? config.dropLabel,
    tracklistMaxHeight: script.dataset.tracklistMaxHeight ?? config.tracklistMaxHeight,
    theme,
    tracks,
  };
}

function mountWidgetFromScript(script) {
  if (!script || script.__mixtapeMounted) {
    return null;
  }

  script.__mixtapeMounted = true;
  const config = buildConfigFromScriptTag(script);
  const player = document.createElement("mixtape-player");

  if (script.dataset.className) {
    player.className = script.dataset.className;
  }

  const targetSelector = script.dataset.target;
  if (targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) {
      throw new Error(`MixtapePlayer target not found: ${targetSelector}`);
    }
    target.appendChild(player);
    if (!parseBooleanAttribute(script.dataset.keepScript, false)) {
      script.remove();
    }
  } else {
    script.parentNode?.insertBefore(player, script);
    if (!parseBooleanAttribute(script.dataset.keepScript, false)) {
      script.remove();
    }
  }

  player.load(config);
  return player;
}

if (!customElements.get("mixtape-player")) {
  customElements.define("mixtape-player", MixtapePlayerElement);
}

window.MixtapePlayer = {
  variants: VARIANT_PRESETS,
  create(target, config) {
    const mountTarget = typeof target === "string" ? document.querySelector(target) : target;
    if (!mountTarget) {
      throw new Error("MixtapePlayer mount target was not found.");
    }

    const element = document.createElement("mixtape-player");
    mountTarget.appendChild(element);
    element.load(config);
    return element;
  },
  mountFromScript(script = document.currentScript) {
    return mountWidgetFromScript(script);
  },
};

if (document.currentScript?.dataset.mixtapeWidget !== undefined) {
  mountWidgetFromScript(document.currentScript);
}
