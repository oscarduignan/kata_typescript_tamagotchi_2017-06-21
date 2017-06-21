jest.useFakeTimers();

class TamagotchiError {}

class TamagotchiFullError extends TamagotchiError {}

class Tamagotchi {
  constructor(private hungry: Boolean = true, private angry: Boolean = false) {}

  isHungry = () => this.hungry;

  isAngry = () => this.angry;

  feed() {
    if (!this.hungry) {
      this.angry = true;
      throw new TamagotchiFullError();
    }
    this.angry = false;
    this.hungry = false;
    setTimeout(() => (this.hungry = true), 5000);
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

it("should get angry if you try to feed it twice while its full", () => {
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
