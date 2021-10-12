import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  map,
  mergeAll,
  switchMap,
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
export class ListPokemonComponent implements OnInit {
  @ViewChild('inputText', { static: true, read: ElementRef })
  inputText!: ElementRef<HTMLInputElement>;

  offset = 0;
  limit? : number;
  listPokemon$!: Observable<PokemonDetail[]>;
  pokemonEvent$!: Observable<Event>;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.pokemonEvent$ = fromEvent(this.inputText!.nativeElement, 'input');

    this.listPokemon$ = this.pokemonEvent$.pipe(
      debounceTime(400),
      switchMap(() => this.searchPokemon()),
      switchMap((res) =>
        from(res.map((item) => this.getPokemonDetail(item))).pipe(
          mergeAll(),
          toArray()
        )
      )
    );
  }

  searchPokemon() {
    return this.http
      .get<PokemonCount>(
        `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=${this.limit}`
      )
      .pipe(map((response) => response.results));
  }

  getPokemonDetail(pokemon: Pokemon) {
    return this.http.get<PokemonDetail>(pokemon.url);
  }
}
