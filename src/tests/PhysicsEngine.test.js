import PhysicsEngine from '../PhysicsEngine';

describe('PhysicsEngine', () => {
  let physicsEngine;
  let vehicle;

  beforeEach(() => {
    physicsEngine = new PhysicsEngine();
    vehicle = {
      vx: 0,
      vy: 100,
      angle: 0,
      thrust: 500000,
      mass: 100000,
    };
  });

  it('should apply gravity correctly', () => {
    physicsEngine.applyGravity(vehicle, 1);
    expect(vehicle.vy).toBeCloseTo(100 - 9.81);
  });

  it('should apply thrust correctly', () => {
    physicsEngine.applyThrust(vehicle, 1);
    expect(vehicle.vy).toBeCloseTo(100 + (500000 / 100000));
  });
});
