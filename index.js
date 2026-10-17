// Задача: Список N постов
// Написать функцию, которая использует API https://jsonplaceholder.typicode.com/, чтобы получит список первых N постов по урлу /posts и вывести их в консоль

// function getPosts(n) {

//     return fetch('https://jsonplaceholder.typicode.com/posts')
//         .then(response => response.json())
//         .then(json => json.slice(0, n))

// }

// getPosts(10)
//     .then(posts => console.log(posts))
//     .catch(err => console.log(err))





// Задача: Список постов с комментариями
// Написать функцию, которая использует API https://jsonplaceholder.typicode.com/, чтобы получит список первых N постов по урлу /posts , а также их комментарии по урлу /comments и вывести их в виде объектов со следующей структурой:
// {
// userId:	1
// id:	1
// title:	"sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
// body:	"quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
// // вот тут новое поле добавляется
// comments: [] // тут список комментов
// }


// function getPostsWithComments(n) {
    
//     const arrayPost = fetch('https://jsonplaceholder.typicode.com/posts')
//         .then(response => response.json())
//         .then(json => json.slice(0, n))


//     const arrayComment = fetch('https://jsonplaceholder.typicode.com/comments')
//         .then(response => response.json())
//         .then(json => json)


//     return Promise.all([arrayPost, arrayComment])
//         .then(([posts, comments]) => {
//             return posts.map(post => {
//                 const postComments = comments.filter(comment => {
//                     return comment.postId === post.id
//                 })

//                 return {...post, comments: postComments}
//             })
//         })
        

    
// }


// getPostsWithComments(10)
//     .then(posts => console.log(posts));






// Задача: Список постов с комментами и юзерами
// На основе предыдущих заданий добавить к объекту поста объект user’а из /users

// {
// userId	1
// id	1
// title	"sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
// body	"quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
// // вот тут новое поле добавляется
// comments: [] // тут список комментов
// user: {} // тут объект с информацией о юзере
// }


function getFullPosts(n) {

    const arrayPost = fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(json => json.slice(0, n))


    const arrayComment = fetch('https://jsonplaceholder.typicode.com/comments')
        .then(response => response.json())
        .then(json => json)

    const arrayUsers = fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(json => json)


    return Promise.all([arrayPost, arrayComment, arrayUsers])
        .then(([posts, comments, users]) => {
            return posts.map(post => {
                const postComments = comments.filter(comment => {
                    return comment.postId === post.id
                })

                const postUsers = users.find(user => {
                    return user.id === post.userId
                })

                return {...post, comments: postComments, user: postUsers}
            })
        })

    
}


getFullPosts(10)
    .then(result => console.log(result))






// Задача: Список персонажей фильма
// Есть АПИ для поиска фильмов https://swapi.dev/, с помощью него можно получить список фильмов по названию, сходив по `/api/films/?search={title}`

// По этому урлу можно получить объект, в котором будет массив `characters`, это массив с урлами на персонажей.
// Если сходить по каждому урлу, можно получить персонажа фильма (в виде JSON объекта)

// Задача: вывести в консоль список первых 10-ти персонажей фильма, в виде объектов


function getCharacters(filmTitle) {
    return fetch(`https://swapi.dev/api/films/?search=${filmTitle}`)
        .then(responce => {
            
            if (!responce.ok) {
                throw new Error('Фильм не найден')
            }

            return responce.json()
        })
}

getCharacters('A New Hope')
    .then(result => {

        if (!result.results || result.results.length === 0) {
            throw new Error('Фильм не найден')
        }

        const characters = (result.results[0].characters).slice(0, 10)
        return characters
    })
    .then(characters => {

        const promises = characters.map(url => {
            return fetch(url)
                .then(responce => responce.json())
        })

        return Promise.all(promises)
    })
    .then(result => console.log(result))
    .catch(error => console.error('Ошибка', error))





// Задание: Список уникальных планет
// В предыдущем задании выводился список персонажей. Если заметить, то у персонажей есть поля name и homeworld

// homeworld это также урл, по которому можно получить подробности о планете персонажа

// Задача: собрать у первых 10-ти персонажей их планеты и вывести список уникальных планет, а также какой персонаж к какой планете относится


function getUniquePlanets(filmTitle) {

    return fetch(`https://swapi.dev/api/films/?search=${filmTitle}`)
        .then(responce => {
            if (!responce.ok) {
                throw new Error('Фильм не найден')
            }

            return responce.json()
        })
}

getUniquePlanets('A New Hope')
    // Ищем первых 10 персонажей 
    .then(result => {
        const characters = (result.results[0].characters).slice(0, 10)
        return characters
    })
    // Получаем массив из промисов 
    .then(characters => {

        const promise = characters.map(url => {
            return fetch(url)
                .then(responce => responce.json())
        })

        // Получаем массив объектов персонажей 
        return Promise.all(promise)
    })
    
    .then(charactersData => {

        const promise = charactersData.map(character => {

            // Для каждого персонажа делаем fetch с планетой
            return fetch(character.homeworld)
                .then(responce => responce.json())
                .then(planet => {
                    // Возвращаем объект с персонажами и планетами
                    return {character, planet}
                })
        })

        return Promise.all(promise)
    })
    .then(result => {
        const uniquePlanets = result.reduce((acc, {character, planet}) => {
            // Выбираем только уникальные значения 
            if (!acc[planet.name]) {
                acc[planet.name] = [character.name]
            }
            else {
                acc[planet.name].push(character.name)
            }

            return acc
        }, {})

        console.log(uniquePlanets)
        return uniquePlanets
    })
    .catch(error => {
        console.error('Ошибка', error)
    })



// Задача: debounce
// Написать функцию debounce(func, wait)

function debounce(func, wait) {

    let timeoutId = null

    return function(...args) {
        clearTimeout(timeoutId)

        timeoutId = setTimeout(() => {
            func(...args)
        }, wait)
    }
}