import { ReduceTextPipe } from './reduce-text.pipe';

describe('reduceTextPipe', () => {
    let pipe: ReduceTextPipe;

    beforeEach( () => {
        pipe =  new ReduceTextPipe();
    });

    it('should create', () => {
        expect(pipe).toBeTruthy();
    });

    it('use transform correctly', () => {
        const text = 'This is a test text to check the pipe';
        const textTransform = pipe.transform(text, 10);

        expect(textTransform.length).toBe(10);
    });
});
