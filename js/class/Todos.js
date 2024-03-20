import { resolve } from "path";
import { Task } from "./Task.js";
import { response } from "express";

class Todos {
    #tasks = [];
    #backend_ulr = '';

    constructor(url) {
        this.#backend_ulr = ulr;
    }

    getTasks = () => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_ulr);
            .then((response) => response.json());
            .then((json) => {
                this.#readJson(json);
                resolve(this.#tasks);
            }, (error) => {
                reject(error);
            });
        });
    }
}

export { Todos };

const BACKEND_ROOT_URL = 'http://localhost:3001';
import { Todos } from "./class.Todos.js";

const todos = new Todos(BACKEND_ROOT_URL);

const list = document.querySelector('ul');
const input = document.querySelector('input');

input.disabled = true;

