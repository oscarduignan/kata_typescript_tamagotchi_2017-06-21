jest.useFakeTimers();

class TamagotchiError {}

class TamagotchiFullError extends TamagotchiError {}

type TamagotchiState = {
  hungry: boolean;
  angry: boolean;
  lastFed: number;
};

class Tamagotchi {
  private lifecycleTimeout: Number;

  constructor(
    private state: TamagotchiState = {
      hungry: true,
      angry: false,
      lastFed: 0
    },
    private lifecycleInterval: Number = 1000
  ) {
    this.lifecycleTimeout = setInterval(
      () => (this.state = Tamagotchi.evolve(this.state)),
      this.lifecycleInterval
    );
  }

  private static evolve(previousState: TamagotchiState): TamagotchiState {
    return <TamagotchiState>{
      ...previousState,
      lastFed: !previousState.hungry ? previousState.lastFed + 1 : 0,
      hungry: previousState.hungry || previousState.lastFed === 4,
    }
  }

  isHungry = (): Boolean => this.state.hungry;

  isAngry = (): Boolean => this.state.angry;

  feed(): void {
    if (!this.isHungry()) {
      this.state.angry = true;
      throw new TamagotchiFullError();
    }
    this.state.angry = false;
    this.state.hungry = false;
  }
}

it("should be hungry", () => {
  let mi = new Tamagotchi();

  expect(mi.isHungry()).toBeTruthy();
});

it("should not be hungry when fed", () => {
  let mi = new Tamagotchi();
  expect(mi.isHungry()).toBeTruthy();
  mi.feed();
  expect(mi.isHungry()).toBeFalsy();
});

it("should become hungry again after some time has passed", () => {
  let mi = new Tamagotchi();
  mi.feed();
  expect(mi.isHungry()).toBeFalsy();
  jest.runTimersToTime(5000);
  expect(mi.isHungry()).toBeTruthy();
});

it("should refuse food if you try to feed it when its full", () => {
  let mi = new Tamagotchi();
  mi.feed();
  expect(() => {
    mi.feed();
  }).toThrow(TamagotchiFullError);
});

it("should get angry if you try to feed it too often while its full", () => {
  let mi = new Tamagotchi();
  mi.feed();
  expect(mi.isAngry()).toBeFalsy();
  try {
    mi.feed();
  } catch (TamagotchiFullError) {}
  expect(mi.isAngry()).toBeTruthy();
});

it("should no longer be angry after its been fed successfully", () => {
  let mi = new Tamagotchi();
  mi.feed();
  expect(mi.isAngry()).toBeFalsy();
  try {
    mi.feed();
  } catch (TamagotchiFullError) {}
  expect(mi.isAngry()).toBeTruthy();
  jest.runTimersToTime(5000);
  expect(mi.isHungry()).toBeTruthy();
  mi.feed();
  expect(mi.isAngry()).toBeFalsy();
});
