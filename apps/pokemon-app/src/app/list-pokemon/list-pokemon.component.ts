import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { defer, fromEvent } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { Pokemon } from '../interfaces/pokemon';
import { PokemonCount } from '../interfaces/pokemon-count';

@Component({
  selector: 'pokemon-list-pokemon',
  templateUrl: './list-pokemon.component.html',
  styleUrls: ['./list-pokemon.component.css'],
})
export class ListPokemonComponent implements OnInit {
  @ViewChild('inputText', { static: true, read: ElementRef })
  inputText!: ElementRef<HTMLInputElement>;

  listPokemon: Pokemon[] = [];
  offset = 0;
  limit = 20;
  pokemon$: any;
  pokemonEvent$: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.pokemonEvent$ = fromEvent(this.inputText!.nativeElement, 'input');

    this.pokemon$ = this.pokemonEvent$.pipe(
      debounceTime(400),
      switchMap(() => {
        const url = `https://pokeapi.co/api/v2/pokemon/?offset=${this.offset}&limit=${this.limit}/${this.inputText.nativeElement.value}`;
        return this.http.get<PokemonCount>(url).pipe(
          tap((response) => {
            this.listPokemon = response.results;
          })
        );
      })
    );
  }
}
