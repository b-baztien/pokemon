import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  defer,
  EMPTY,
  from,
  fromEvent,
  iif,
  interval,
  merge,
  Observable,
  Subject,
  Subscription,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  catchError,
  concatAll,
  concatMap,
  debounceTime,
  map,
  mergeMap,
  skip,
  skipWhile,
  startWith,
  switchMap,
  switchMapTo,
  takeWhile,
  tap,
  toArray,
} from 'rxjs/operators';
import { Pokemon } from '../interfaces/pokemon';
import { PokemonCount } from '../interfaces/pokemon-count';
import { PokemonDetail } from '../interfaces/pokemon-detail';

@Component({
  selector: 'pokemon-list-pokemon',
  templateUrl: './list-pokemon.component.html',
  styleUrls: ['./list-pokemon.component.css'],
})
export class ListPokemonComponent implements OnInit, OnDestroy {
  @ViewChild('inputText', { static: true, read: ElementRef })
  inputText!: ElementRef<HTMLInputElement>;

  offset = 0;
  limit: number = 100;
  pokemonName: string = '';
  listPokemonSub$!: Subscription;
  listPokemon: PokemonDetail[] = [];

  fetchPokemon$ = defer(() => {
    console.log(`offset=${this.offset}&limit=${this.limit}`);
    return ajax
      .getJSON<PokemonCount>(
        `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=${this.limit}`
      )
      .pipe(
        map((res) => {
          if (this.limit >= res.count) throw new Error(`Is All Pokemon`);
          return res.results;
        }),
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      );
  });

  getPokemonDetail$ = (pokemon: Pokemon) =>
    ajax.getJSON<PokemonDetail>(pokemon.url).pipe(
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );

  constructor() {}

  ngOnInit(): void {
    const pokemonEvent$ = fromEvent(
      this.inputText!.nativeElement,
      'input'
    ).pipe(
      debounceTime(400),
      tap(() => {
        console.log(this.pokemonName);
      })
    );

    const pokemon$ = new Subject();

    this.listPokemonSub$ = pokemonEvent$
      .pipe(
        switchMap(() => {
          this.listPokemon = [];
          this.offset = 0;
          
          return pokemon$.pipe(startWith(null));
        }),
        switchMap(() => this.fetchPokemon$),
        concatMap((res) => {
          return from(res.map((item) => this.getPokemonDetail$(item))).pipe(
            concatAll(),
            toArray(),
            map((res) => {
              const listFilterPokemon = res.filter((pokemon) =>
                pokemon.name.startsWith(this.pokemonName)
              );
              return (this.listPokemon = [
                ...this.listPokemon,
                ...listFilterPokemon,
              ]);
            })
          );
        }),
        takeWhile((res) => res.length < 20),
        tap(() => {
          this.offset += this.limit;
          pokemon$.next();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.listPokemonSub$.unsubscribe();
  }
}
