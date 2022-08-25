const axios = require('axios');
const Sequelize = require('sequelize');
const { name } = require('../app');
const Op = Sequelize.Op;
const { Book, Author, Category, Review ,Publisher} = require('../db');
// const { imageRegex } = require('../utils/validations/regex');
// const { imgVerify } = require('./BooksWithLargeImage');

const maxResults = 40;
const term = [
  'harry potter y',
  'harry potter and',
  'el principito',
  'el señor de los anillos',
  'lord of the rings',
  'increibles',
  'grandes',
  'javascript',
  'fantasticos',
  'comic',
  'locos',
  'sherlock holmes',
  'ethereum',
  'deep web',
  'shakespeare',
];
async function getImage(industryID) {
    let isbn = '';
  
    if (industryID && industryID.length > 1) {
      if (industryID[0].type.includes('10')) {
        isbn = industryID[0].identifier;
      } else if (industryID[1].type.includes('10')) {
        isbn = industryID[1].identifier;
      }
    }
    if (isbn) {
      return `https://images-na.ssl-images-amazon.com/images/P/${isbn}.01._SX180_SCLZZZZZZZ_.jpg`;
    } else
      return 'https://images-na.ssl-images-amazon.com/images/P/0345247868.01._SX180_SCLZZZZZZZ_.jpg';
  }
  

    
    //pokemonCreate.addAuthor(foundType);

 

    //-----------------------------------------------------------------------------------------
    //                                  GET API BOOKS
    //-----------------------------------------------------------------------------------------
const LoadDb =async function () 
 {
      try {
        for (let i = 0; i < term.length; i++) {
          for (let j = 0; j < 5; j++) {
            let api = (
              await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=${
                  term[i]
                }&printType=books&maxResults=${maxResults}&startIndex=${j * 40}
              `
                //&startIndex=${i * 40}
              )
            ).data;
  
            api.items &&
              api.items.map(async (b) => {
                const industryID = b.volumeInfo.industryIdentifiers
                  ? b.volumeInfo.industryIdentifiers
                  : '';
                const img = await getImage(
                  industryID.length > 0 ? industryID : null
                );
                if (b.volumeInfo.title && b.volumeInfo.description) {
                 // console.log(b.volumeInfo.title, b.volumeInfo.description)
                  if (
                    b.volumeInfo.title.length < 10000 &&
                    b.volumeInfo.description.length < 10000
                  ) {
                    let newBook= await Book.create({
                      
                        title: b.volumeInfo.title,
                        description: b.volumeInfo.description ? b.volumeInfo.description: 'No description',
                        price:  (Math.random() * 100).toFixed(2),
  
                        image: img,
                        //industryIdentifiers:b.volumeInfo.industryIdentifiers ,
                       // idPublisher:,
                       // authors: b.volumeInfo.authors ? b.volumeInfo.authors : [],
                        //categories: b.volumeInfo.categories
                        //  ? b.volumeInfo.categories
                      //    : [],
                        //publisher: b.volumeInfo.publisher
                        //  ? b.volumeInfo.publisher
                       //   : 'NO PUBLISHER',
                        publishedDate: b.volumeInfo.publishedDate
                          ? b.volumeInfo.publishedDate
                          : 'NO DATE',
                        pageCount: b.volumeInfo.pageCount
                          ? b.volumeInfo.pageCount
                          : 0,
                        rating: 0,
                        language: b.volumeInfo.language
                          ? b.volumeInfo.language
                          : 'NO INFO',
                          currentStock:100,
                          active:true,
                      },
                    );
                    try {
                      if(b.volumeInfo.authors) b.volumeInfo.authors=['No Identificado']
                       for (const a of b.volumeInfo.authors){
                   // console.log(a)
                    let authorBook=await Author.findOrCreate({where: {name: a }})
                    await newBook.addAuthor(authorBook)

                   }


                    } catch (error) {
                      //console.log(error)
                    }
                  

                      
                    
                    // if(b.volumeInfo.authors.length!==0){
                    //   b.volumeInfo.authors.map( async  (a) =>{

                    //    await  Author.findOrCreate({ name: a });

                    //     let authorfound = getAuthor(a);
                    //     if (authorfound)
                    //       booAddAuto(authorfound);
                    //   });
                    // }
                    

                    let publisherBook = await Publisher.findOrCreate({ where:{ name: b.volumeInfo.publisher }})
                    await newBook.addPublisher(publisherBook)



                    for (const c of b.volumeInfo.categories){
                      let categoryBook=await Author.findOrCreate({where: {name: c }})
                      await newBook.addCategory(categoryBook)
  
                     }
                                                
                    // b.volumeInfo.categories?.map(async (a) => { await  Category.findOrCreate( {name: a })
                    // let categoryfound= getCategory(a)
                    // if (authorfound)   addAuthor(categoryfound);
                    // });    


                                                      

                  }
                }
              });
          }
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }
module.exports=LoadDb;