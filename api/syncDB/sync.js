
const { conn } = require('../src/db.js')
const {
    Apibook,
    Book
} = require('../src/db');
const {
    fillApi,
    fillCategories,
    fillAuthors,
    fillPublisher,
    fillBook,
    setStatuses
} = require('./utils.js')

conn.sync({ force: true }).then(async () => {
    console.log('Starting sync script')
    console.log('Filling ApiBooks table...')
    await fillApi()
    console.log('Done')
    console.log('Filling Categories table...')
    await fillCategories()
    console.log('Done')
    console.log('Filling Authors table...')
    await fillAuthors()
    console.log('Done')
    console.log('Filling Publisher table...')
    await fillPublisher()
    console.log('Done')
    console.log('Filling Books table...')
    console.log(await fillBook())
    console.log('Setting Status table...')
    console.log(await setStatuses())
    console.log('Setting Payment Methods table...')
    console.log(await setPaymentMethods())
    console.log(`${await Book.count()} rows added of ${await Apibook.count()} rows total`)
});