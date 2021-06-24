import { BookService } from './book.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from '../models/book.model';
import { environment } from '../../environments/environment.prod';
import swal from 'sweetalert2';

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


describe('BookService', () => {

    let service: BookService;
    let httpMock: HttpTestingController;

    beforeEach( () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BookService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
    });

    beforeEach( () => {
        /* instanciar service versiones anteriores a Angular 9 */
        // service = TestBed.get(BookService);

        /* instanciar service */
        service = TestBed.inject(BookService);

        /* instanciar httpMock */
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach( () => {
        jest.resetAllMocks();
        localStorage.clear();
    });

    afterEach( () => {
        /* verifica que no existan peticiones pendientes */
        httpMock.verify();
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('getBooks return a list of books with a get method', () => {
        service.getBooks().subscribe( (resp: Book[]) => {
            expect(resp).toEqual(listBook);
        });

        /* valida método de la petición */
        const req = httpMock.expectOne(environment.API_REST_URL + `/book`);
        expect(req.request.method).toEqual('GET');

        /* simula la respuesta de la petición al servicio */
        req.flush(listBook);
    });

    it('getBooksFromCart return an empty array when localStorage is empty', () => {
        const listBookEmpt: Book[] = service.getBooksFromCart();
        expect(listBookEmpt.length).toBe(0);
    });

    it('getBooksFromCart return an array of books when it exist in the localStarage', () => {
        localStorage.setItem('listCartBook', JSON.stringify(listBook));
        const newListBook: Book[] = service.getBooksFromCart();
        expect(newListBook.length).toBe(3);
    });

    it('addBookToCart add a book successfully when the list does not exist in the localStorage', () => {
        const book: Book = listBook[0];

        const toasMock = {
            fire: () => null
        } as any;

        const spy = jest.spyOn(swal, 'mixin').mockImplementation( () => {
            return toasMock;
        });

        let newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(0);

        service.addBookToCart( book);

        newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(1);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('removeBooksFromCart remove the list of books from localStorage', () => {
        const toasMock = {
            fire: () => null
        } as any;

        jest.spyOn(swal, 'mixin').mockImplementation( () => {
            return toasMock;
        });

        const book: Book = listBook[2];

        service.addBookToCart(book);
        let newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(1);

        service.removeBooksFromCart();
        newListBook = service.getBooksFromCart();
        expect(newListBook.length).toBe(0);
    });
});
