import Rocket from '../Rocket';
import Booster from '../Booster';
import Starship from '../Starship';

jest.mock('../Booster');
jest.mock('../Starship');

describe('Rocket', () => {
  let rocket;
  let p5;

  beforeEach(() => {
    Booster.mockClear();
    Starship.mockClear();
    p5 = {}; // Mock p5 instance
    rocket = new Rocket(p5, 0, 0);
  });

  it('should create a booster and a starship', () => {
    expect(Booster).toHaveBeenCalledTimes(1);
    expect(Starship).toHaveBeenCalledTimes(1);
  });

  it('should separate the starship from the booster', () => {
    const { booster, starship } = rocket.separate();
    expect(starship.boosterAttached).toBe(false);
  });
});
