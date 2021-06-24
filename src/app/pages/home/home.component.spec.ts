import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { of } from 'rxjs';

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


/* crear BookService mock */
const bookServiceMock = {
    getBooks: () => of(listBook)
};

/* Pipe mock */
@Pipe ( {name: 'reduceText'} )
class ReducePipeMock implements PipeTransform {
    transform(): string {
        return '';
    }
}

describe('Home component', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;

    beforeEach( () => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [
                HomeComponent,
                ReducePipeMock
            ],
            providers: [
                // BookService
                /* crear servicio mock */
                {
                    provide: BookService,
                    useValue: bookServiceMock
                }
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        }).compileComponents();
    });

    beforeEach( () => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    /* test de método con subscribe */
    it('getBooks get books from the subscription', () => {
        /* obtener servicio */
        const bookService = fixture.debugElement.injector.get(BookService);

        /* espía que retorna listbook mock */
        // const spy = jest.spyOn(bookService, 'getBooks').mockReturnValueOnce( of(listBook) );

        /* llama al método */
        component.getBooks();

        // expect(spy).toHaveBeenCalledTimes(1);
        expect(component.listBook.length).toBe(3);
        expect(component.listBook).toEqual(listBook);
    });
});
