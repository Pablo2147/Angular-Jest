import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CartComponent } from './cart.component';
import { BookService } from '../../services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from '../../models/book.model';
import { By } from '@angular/platform-browser';

/* arreglo mock para pruebas */
const listBook: Book[] = [
    {
        name: '',
        author: '',
        isbn: '',
        price: 15,
        amount: 2
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 20,
        amount: 1
    },
    {
        name: '',
        author: '',
        isbn: '',
        price: 8,
        amount: 7
    }
];

describe('Cart component', () => {

    let component: CartComponent;
    let fixture: ComponentFixture<CartComponent>;
    let service: BookService;

    beforeEach( () => {
        /* configuraciones para el test */
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            declarations: [ CartComponent ],
            providers: [ BookService ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach( () => {
        /* extraemos el componente desde TestBed */
        fixture = TestBed.createComponent(CartComponent);

        /* instanciamos el componente */
        component = fixture.componentInstance;

        /* componente entra por el OnInit */
        fixture.detectChanges();

        /* obtenemos el servicio y lo dejamos dispinible de forma global */
        service = fixture.debugElement.injector.get(BookService);

        /* mock método getBooksFromCart del onInit */
        jest.spyOn(service, 'getBooksFromCart').mockImplementation( () => listBook);
    });

    afterEach( () => {
        /* destruye el fixture y resetea los mocks */
        fixture.destroy();
        jest.resetAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /* prueba de método con return */
    it('getTotalPrice returns an amount', () => {
        const totalPrice = component.getTotalPrice(listBook);
        expect(totalPrice).toBeGreaterThanOrEqual(0);
        // expect(totalPrice).not.toBe(0);
        // expect(totalPrice).not.toBeNull();
    });

    /* prueba de método SIN return */
    it('onInputNumberChange increments correctly', () => {
        const action = 'plus';
        const book: Book = listBook[0];

        /* obtener servicio - forma para versiones anteriores a Angular 9 */
        // const service2 = TestBed.get(BookService);

        /* obtener servicio */
        // const service = fixture.debugElement.injector.get(BookService);

        /* crear espías para métodos updateAmountBook y getTotalPrice */
        const spy1 = jest.spyOn(service, 'updateAmountBook').mockImplementation( () => null);
        const spy2 = jest.spyOn(component, 'getTotalPrice').mockImplementation( () => null);

        expect(book.amount).toBe(2);
        component.onInputNumberChange(action, book);
        expect(book.amount).toBe(3);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

    });


    /* prueba de método SIN return */
    it('onInputNumberChange decrements correctly', () => {
        const action = 'minus';
        const book: Book = listBook[2];

        expect(book.amount).toBe(7);
        component.onInputNumberChange(action, book);
        expect(book.amount).toBe(6);
    });

    /* prueba método privado  _clearListCartBook */
    it('onClearBooks works correctly', () => {
        const spy = jest.spyOn(service, 'removeBooksFromCart').mockImplementation( () => null);

        /* espiar un método privado */
        const spy2 = jest.spyOn(component as any, '_clearListCartBook');

        component.listCartBook = listBook;
        component.onClearBooks();
        expect(component.listCartBook.length).toBe(0);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
    });

    it('the title "The cart is empty" is not displayed when there is a list', () => {
        component.listCartBook = listBook;

        /* detecta los cambios en el componente */
        fixture.detectChanges();

        const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
        expect(debugElement).toBeFalsy();
    });


    it('the title "The cart is empty" is displayed when the list is empty', () => {
        component.listCartBook = [];
        /* detecta los cambios en el componente */
        fixture.detectChanges();
        const debugElement: DebugElement = fixture.debugElement.query(By.css('#titleCartEmpty'));
        expect(debugElement).toBeTruthy();

        /* verificar texto "The cart is empty" en el html */
        if (debugElement){
            /* extrae el elemento html */
            const element: HTMLElement = debugElement.nativeElement;
            expect(element.innerHTML).toContain('The cart is empty');
        }
    });
});
