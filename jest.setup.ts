jest.mock("react-native-mmkv", () => {
  const stores = new Map<string, Map<string, string>>();

  class MMKV {
    private id: string;

    constructor(options?: { id?: string }) {
      this.id = options?.id ?? "default";
      if (!stores.has(this.id)) {
        stores.set(this.id, new Map());
      }
    }

    getString(key: string) {
      return stores.get(this.id)?.get(key);
    }

    set(key: string, value: string) {
      stores.get(this.id)?.set(key, value);
    }

    delete(key: string) {
      stores.get(this.id)?.delete(key);
    }

    clearAll() {
      stores.get(this.id)?.clear();
    }
  }

  return {
    MMKV,
    __resetMMKV: () => stores.forEach((store) => store.clear()),
    __getMMKVStore: (id = "default") => stores.get(id),
  };
});

jest.mock("expo-network", () => {
  let networkState = {
    isConnected: true,
    isInternetReachable: true,
    type: "WIFI",
  };

  return {
    NetworkStateType: {
      NONE: "NONE",
      UNKNOWN: "UNKNOWN",
      WIFI: "WIFI",
      CELLULAR: "CELLULAR",
    },
    getNetworkStateAsync: jest.fn(() => Promise.resolve(networkState)),
    addNetworkStateListener: jest.fn(() => ({ remove: jest.fn() })),
    __setNetworkState: (state: Partial<typeof networkState>) => {
      networkState = { ...networkState, ...state };
    },
  };
});

jest.mock("expo-audio", () => {
  const audioMock = {
    players: [] as any[],
    createError: null as Error | null,
    setCreateError(error: Error | null) {
      this.createError = error;
    },
    reset() {
      this.players = [];
      this.createError = null;
    },
  };

  return {
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
    createAudioPlayer: jest.fn((url: string) => {
      if (audioMock.createError) {
        throw audioMock.createError;
      }

      const listeners: ((status: any) => void)[] = [];
      const player = {
        url,
        addListener: jest.fn(
          (_eventName: string, listener: (status: any) => void) => {
            listeners.push(listener);
            return {
              remove: jest.fn(() => {
                const index = listeners.indexOf(listener);
                if (index >= 0) {
                  listeners.splice(index, 1);
                }
              }),
            };
          },
        ),
        emitStatus(status: any) {
          listeners.forEach((listener) => listener(status));
        },
        play: jest.fn(() => {
          listeners.forEach((listener) =>
            listener({
              playing: true,
              isLoaded: true,
              isBuffering: false,
              duration: 10,
              currentTime: 0,
              didJustFinish: false,
            }),
          );
        }),
        pause: jest.fn(),
        remove: jest.fn(),
        setActiveForLockScreen: jest.fn(),
      };
      audioMock.players.push(player);
      return player;
    }),
    __audioMock: audioMock,
  };
});
