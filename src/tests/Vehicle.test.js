import Vehicle from '../Vehicle';

describe('Vehicle', () => {
  let p;
  let vehicle;

  beforeEach(() => {
    // Mock p5 object
    const mockVector = {
        div: (force, mass) => {
            return {
                x: force.x / mass,
                y: force.y / mass,
                add: jest.fn()
            }
        }
    }
    p = {
      createVector: (x, y) => ({ x, y, add: jest.fn(), mult: jest.fn() }),
      constructor: {
        Vector: mockVector
      },
    };
    vehicle = new Vehicle(p, 0, 0, 1, 100, 10, 20);
  });

  it('should not throw an error when applying force', () => {
    const force = { x: 0, y: 1 };
    expect(() => vehicle.applyForce(force)).not.toThrow();
  });
});
