


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Пагинация и загрузка списка курсов и репетиторов

//Переменные, используемые в пагинации
let currentCoursePage = 1; //Текущая страница в пагинации курсов
let currentTutorPage = 1; //Текущая страница в пагинации репетиторов

const COURSES_PER_PAGE = 3; //Количество курсов на одной странице в пагинации
const TUTORS_PER_PAGE = 3; //Количество репетиторов на одной странице в пагинации

//Обработчик элементов, связанных с пагинацией списка курсов и репетиторов
document.addEventListener("DOMContentLoaded", () => {
    initPaginationCourses();
    initPaginationTutors();
});



//Рендер курсов
function renderCoursesPage(page) {
    const table = document.getElementById("tableCourse");
    table.innerHTML = "";

    const start = (page - 1) * COURSES_PER_PAGE;
    const end = start + COURSES_PER_PAGE;

    allCourses.slice(start, end).forEach(course => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="TableCellCourse">${course.name}</td>
            <td class="TableCellCourse">${course.level}</td>
        `;
        table.appendChild(tr);
    });
}



//Рендер репетиторов
function renderTutorsPage(page) {

    const table = document.getElementById("tableTutors");
    table.innerHTML = "";

    const start = (page - 1) * TUTORS_PER_PAGE;
    const end = start + TUTORS_PER_PAGE;

    allTutors.slice(start, end).forEach(tutor => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="TableCellCourse">
                Преподаватель ${tutor.name} — Преподаёт ${tutor.languages_offered.join(", ")} — Опыт работы: ${tutor.work_experience} лет
            </td>
        `;
        table.appendChild(tr);
    });
}

//обновление активных и неактивных кнопок пагинации списка курсов и списка репетиторов
document.querySelectorAll(".PaginationTableCourse")
  .forEach(paginationTable => {
    paginationTable.addEventListener("click", (e) => {

        const clickedCell = e.target.closest(
            ".PaginationCellCourse, .PaginationChosenCellCourse"
        );
        if (!clickedCell) return;

        paginationTable
            .querySelectorAll(".PaginationChosenCellCourse")
            .forEach(el => {
                el.classList.remove("PaginationChosenCellCourse");
                el.classList.add("PaginationCellCourse");
            });

        clickedCell.classList.remove("PaginationCellCourse");
        clickedCell.classList.add("PaginationChosenCellCourse");
    });
});


//Пагинация списка курсов
function initPaginationCourses() {
    document.querySelectorAll("#paginationCourses .PaginationCellCourse")
        .forEach(cell => {
            cell.addEventListener("click", () => {
                handleCoursePage(cell.dataset.page);
            });
        });
}

function handleCoursePage(page) {
    if (page === "prev") currentCoursePage--;
    else if (page === "next") currentCoursePage++;
    else currentCoursePage = Number(page);

    currentCoursePage = Math.max(1, Math.min(3, currentCoursePage));
    renderCoursesPage(currentCoursePage);
}

//Пагинация списка репетиторов
function initPaginationTutors() {
    document.querySelectorAll("#paginationTutors .PaginationCellCourse")
        .forEach(cell => {
            cell.addEventListener("click", () => {
                handleTutorPage(cell.dataset.page);
            });
        });
}

function handleTutorPage(page) {
    if (page === "prev") currentTutorPage--;
    else if (page === "next") currentTutorPage++;
    else currentTutorPage = Number(page);

    currentTutorPage = Math.max(1, Math.min(2, currentTutorPage));
    renderTutorsPage(currentTutorPage);
}

//Загрузка курсов

let allCourses = [];//Все данные курсов

function loadCourses() {
    fetch("http://exam-api-courses.std-900.ist.mospolytech.ru/api/courses?api_key=f97f0ebd-977c-4c9b-833e-8310102212a4")
        .then(res => res.json())
        .then(data => {
            allCourses = data;
            renderCoursesPage(1);
        })
        .catch(console.error);
}

//Загрузка репетиторов

let allTutors = []; //Все данные репетиторов

function loadTutors() {
    fetch("http://exam-api-courses.std-900.ist.mospolytech.ru/api/tutors?api_key=f97f0ebd-977c-4c9b-833e-8310102212a4")
        .then(res => res.json())
        .then(data => {
            allTutors = data;
            renderTutorsPage(1);
        })
        .catch(console.error);
}

loadCourses();

loadTutors();



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Строка поиска курса и репетитора

//Объявление переменных в строке поиска курса
const inputCourse = document.getElementById('SearchInputCourse')//Строка ввода в строке поиска курса
const dropdownCourse = document.getElementById('dropdownCourse')//Модальное окно под строкой поиска курса
const selectCourse = document.getElementById('ChooseLevelCourse')//Раскрывающаяся таблица, показывающая все уровни курсов

//Объявление переменных в строке поиска репетиторов
const inputTutor = document.getElementById("SearchInputTutor");//Строка ввода в строке поиска репетитора
const dropdownTutor = document.getElementById("dropdownTutor");//Модальное окно под строкой поиска репетитора
const selectTutor = document.getElementById("ChooseLevelTutor");//Раскрывающаяся таблица, содержащая значения про языки, которые преподают репетиторы

//Объявление переменных для кнопок
const ButtonFindCourse = document.getElementById('ButtonFindCourse')//Кнопка "Найти" в строке поиска курса
const ButtonFindTutor = document.getElementById('ButtonFindTutor')//Кнопка "Найти" в строке поиска репетитора

//Выбранный язык, который преподаёт репетитор (в строке поиска репетиторов)
let chosenLanguageTutor = "";

//Выбранный уровень курсов, который дан курсу (в строке поиска курсов)
let ChooseLevelCourse = "";

//Выбранные курс и репетитор
let SectionOfChosenThings = document.getElementById('SectionOfChosenThings')//Вообще вся секция с выбранными курсом и репетитором
let chosenThings = document.getElementById('ChosenThings')//Весь блок только с выбранными курсом и репетитором
let chosenTutor = document.getElementById('ChosenTutor')//Выбранный в строке поиска репетитор
let chosenCourse = document.getElementById('ChosenCourse')//Выбранный в строке поиска курс

SectionOfChosenThings.innerHTML="";//Изначально вся секция с выбранными курсом и репетитором пустая

//Переменная, показывающая, что был создан блок, в котором хранятся все выбранные вещи
let didcreateSectionOfChosenThingsWorked = 0;

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Функция, добавляющая и обновляющая модальное окно под строкой поиска курса
function updateCourseDropdown() {
    const value = inputCourse.value.trim().toLowerCase();
    dropdownCourse.innerHTML = "";
    dropdownCourse.classList.remove("hidden");

    let found = false;

    allCourses.forEach(course => {
        const tutorName = course.name.toLowerCase();

        const matchesName =
            value === "" || tutorName.startsWith(value);

        const matchesLanguage =
                ChooseLevelCourse === "" ||
                ChooseLevelCourse === "all" ||
                course.level === ChooseLevelCourse;

        if (matchesName && matchesLanguage) {
            const div = document.createElement("div");
            div.className = "dropdown-item";
            div.textContent = course.name;
            dropdownCourse.appendChild(div);
            found = true;
        }
    });

    if (!found) {
        dropdownCourse.innerHTML =
            "<div class='dropdown-item'>Ничего не найдено</div>";
    }
}


//Обработчики событий в строке поиска в курсах

//Обработчик событий при вводе значения в строке ввода
inputCourse.addEventListener("input", updateCourseDropdown);

//Обработчик событий при проставлении курсора в строке ввода
inputCourse.addEventListener("focus", updateCourseDropdown);

//Обработчик событий при изменении выбора в раскрывающемся списке
selectCourse.addEventListener("change", () => {
    ChooseLevelCourse = selectCourse.value;
    updateCourseDropdown();
});

//Обработчик событий, который удаляет модальное окно, если нажать в любое другое место
document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchCourses")) {
        dropdownCourse.classList.add("hidden");
    }
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Функция, добавляющая и обновляющая модальное окно под строкой поиска репетитора
function updateTutorDropdown() {
    const value = inputTutor.value.trim().toLowerCase();
    dropdownTutor.innerHTML = "";
    dropdownTutor.classList.remove("hidden");

    let found = false;

    allTutors.forEach(tutor => {
        const tutorName = tutor.name.toLowerCase();

        const matchesName =
            value === "" || tutorName.startsWith(value);

        const matchesLanguage =
            chosenLanguageTutor === "" ||
            tutor.languages_offered.includes(chosenLanguageTutor);

        if (matchesName && matchesLanguage) {
            const div = document.createElement("div");
            div.className = "dropdown-item";
            div.textContent = tutor.name;
            dropdownTutor.appendChild(div);
            found = true;
        }
    });

    if (!found) {
        dropdownTutor.innerHTML =
            "<div class='dropdown-item'>Ничего не найдено</div>";
    }
}

//Обработчики событий в строке поиска в курсах

//Обработчик событий при вводе значения в строке ввода
inputTutor.addEventListener("input", updateTutorDropdown);

//Обработчик событий при проставлении курсора в строке ввода
inputTutor.addEventListener("focus", updateTutorDropdown);

//Обработчик событий при изменении выбора в раскрывающемся списке
selectTutor.addEventListener("change", () => {
    chosenLanguageTutor = selectTutor.value;
    updateTutorDropdown();
});

//Обработчик событий, который удаляет модальное окно, если нажать в любое другое место
document.addEventListener("click", (e) => {
    if (!e.target.closest("#searchTutors")) {
        dropdownTutor.classList.add("hidden");
    }
});
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
/* 
Кнопки "Найти" в строке поиска курса/репетитора
*/

//Функция, которая создаёт блок, хранящий все выбранные элементы
function createSectionOfChosenThings(){
    SectionOfChosenThings.innerHTML =
    `
    <section id="SectionOfChosenThings">
        <div class="BorderLineBetweenTextBlocks">
                              
        </div>
        <div class="ChosenThings">
            <h3>Выбранный курс/преподаватель</h3>
            <div id="ChosenCourse"></div>
            <div id="ChosenTutor"></div>
        </div>
        <div class="BorderLineBetweenTextBlocks">

        </div>
    </section>
    `;

    chosenTutor = document.getElementById("ChosenTutor");
    chosenCourse = document.getElementById("ChosenCourse");

    didcreateSectionOfChosenThingsWorked = 1;

}

//Функция, срабатывающая при нажатии кнопки по поиску курса, что приведёт к тому, что найденный курс будет отображен на странице
function youChooseCourse(){
    allCourses.forEach(course => {
        if (inputCourse.value === course.name){
            if (didcreateSectionOfChosenThingsWorked === 0){
                createSectionOfChosenThings();
                chosenCourse.classList.add("ChosenCourseAndTutor");
                chosenCourse.innerHTML = 
                `${course.name}`;
            }
            else if (didcreateSectionOfChosenThingsWorked === 1){
                chosenCourse.classList.add("ChosenCourseAndTutor");
                chosenCourse.innerHTML = 
                `${course.name}`;
            }
        }
    })
}

//Обработчик событий, где при нажатии на кнопку в строке поиска курса на страницце будет отображён выбранный курс
ButtonFindCourse.addEventListener("click", youChooseCourse);

//Функция, срабатывающая при нажатии кнопки по поиску репетитора, что приведёт к тому, что найденный репетитор будет отображен на странице
function youChooseTutor(){
    allTutors.forEach(tutor => {
        if (inputTutor.value === tutor.name){
            if (didcreateSectionOfChosenThingsWorked === 0){
                createSectionOfChosenThings();
                chosenTutor.classList.add("ChosenCourseAndTutor");
                chosenTutor.innerHTML = 
                `Преподаватель ${tutor.name} — Преподаёт ${tutor.languages_offered.join(", ")} — Опыт работы: ${tutor.work_experience} лет`;
            }
            else if (didcreateSectionOfChosenThingsWorked === 1){
                chosenTutor.classList.add("ChosenCourseAndTutor");
                chosenTutor.innerHTML = 
                `Преподаватель ${tutor.name} — Преподаёт ${tutor.languages_offered.join(", ")} — Опыт работы: ${tutor.work_experience} лет`;
            }
        }
    })
}

//Обработчик событий, где при нажатии на кнопку в строке поиска репетиторов на страницце будет отображён выбранный репетитор
ButtonFindTutor.addEventListener("click", youChooseTutor);


