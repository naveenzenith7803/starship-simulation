import Controls from '../src/Controls.js';

// Mock p5.js instance
const p5Mock = {
    keyIsDown: jest.fn(),
};

// Mock rocket, booster, and starship objects
const rocketMock = {};
const boosterMock = { attached: false };
const starshipMock = { isAutopilotActive: false };

describe('Controls', () => {
    let controls;

    beforeEach(() => {
        controls = new Controls(p5Mock);
        starshipMock.isAutopilotActive = false;
        p5Mock.keyIsDown.mockClear();
    });

    it('should not toggle autopilot when "A" is pressed', () => {
        p5Mock.keyIsDown.mockImplementation(keyCode => keyCode === 65);
        controls.update(rocketMock, boosterMock, starshipMock, 'IN_FLIGHT_STAGE2');
        expect(starshipMock.isAutopilotActive).toBe(false);
    });

    it('should toggle autopilot when "P" is pressed', () => {
        p5Mock.keyIsDown.mockImplementation(keyCode => keyCode === 80);
        controls.update(rocketMock, boosterMock, starshipMock, 'IN_FLIGHT_STAGE2');
        expect(starshipMock.isAutopilotActive).toBe(true);
    });
});
