const createAutoComplete = ({ autoComplete, renderOption, onOptionSelect, inputValue, fetchData }) => {

    autoComplete.innerHTML = `
    <label><b>Search</b></label>
    <input class="input"/>

    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    `;

    const dropdown = autoComplete.querySelector('.dropdown');
    const itemList = autoComplete.querySelector('.results');
    const searchInput = autoComplete.querySelector('.input');

    const searchItems = async event => {
        const items = await fetchData(event.target.value);
        if (!items.length) {
            dropdown.classList.remove('is-active')
            return; // ends the searchItems function here
        }
        itemList.innerHTML = '';
        dropdown.classList.add('is-active');
        for(let item of items) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener('click', () => {
                searchInput.value = inputValue(item);
                dropdown.classList.remove('is-active');
                onOptionSelect(item);
            })

            itemList.appendChild(option);
        }
    };
    searchInput.addEventListener('input', debounce(searchItems, 500));
    document.addEventListener('click', e => {
        if(!autoComplete.contains(e.target)) {
            dropdown.classList.remove('is-active');
        }
    })
}