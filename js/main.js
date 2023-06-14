let boundEventHandler;
const searchList = document.querySelector('.search-list');
const searchInput = document.querySelector('.search-input');
const fragment = document.createDocumentFragment();

function onChange(event) {
  let url = new URL('https://api.github.com/search/repositories');
  url.searchParams.set('q', event.target.value);
  
  if (event.target.value.trim()) {
    fetch(url)
    .then((response) => response.json())
    .then((response) => autoCompleter(response))
    .catch((error) => console.log(error));
  } else {
    searchList.innerHTML = '';
  }
}

function autoCompleter(response) {
  searchList.innerHTML = '';
      
  for (let i = 0; i < 5; i++) {
    const li = document.createElement('li');
    li.textContent = response.items[i].name;
    li.setAttribute('data-id', `${i}`);
    li.classList.add('search-list__item');
    fragment.appendChild(li);
  }
  searchList.appendChild(fragment);
  
  boundEventHandler = addRepoToList(response);
  searchList.onclick = boundEventHandler;
}

function addRepoToList(response) {

  return function(event) {
    const currentID = event.target.dataset.id;
    const container = document.querySelector('.repo-list');

    container.insertAdjacentHTML(
      'afterbegin',
      `<li class='repo-list__card'>
        <ul>
          <li>Name: ${response.items[currentID].name}</li>
          <li>Owner: ${response.items[currentID].owner.login}</li>
          <li>Stars: ${response.items[currentID].stargazers_count}</li>
        </ul>
        <img src='assets/img/cross.svg' data-cross alt='cross icon that deletes the repository'>
      </li>`
    )

    searchInput.value = '';
    searchList.innerHTML = '';
  } 
}

const debounce = (func, ms) => {
  let timeout;

  return function() {
    const fnCall = () => {
      func.apply(this, arguments);
    }

    clearTimeout(timeout);
    timeout = setTimeout(fnCall, ms);
  };
}

function deleteElement(event) {
  if (event.target.dataset.cross != undefined) {
    const element = event.target.closest('li');
    element.remove();
  }
}

onChange = debounce(onChange, 400);
searchInput.addEventListener('keyup', onChange);
document.addEventListener('click', deleteElement);
