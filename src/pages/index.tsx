import { GetStaticProps } from 'next';
import Header from '../components/Header';
import Link from 'next/link';
import Prismic from '@prismicio/client'
import Head from "next/head";

import { getPrismicClient } from '../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import {FiCalendar, FiUser} from 'react-icons/fi';
import { useState } from 'react';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;

  };
  
}
interface PostsProps {
  posts: Post[];
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

 export default function Home({postsPagination }: HomeProps): JSX.Element{  // TODO    
   
      const formattedPost = postsPagination.results.map(post => {
        return {
          ...post,          
          first_publication_date: format(
            new Date(post.first_publication_date), 
            'dd MMM yyyy',
            {
              locale: ptBR,              
            })
          }
        })
        const [posts, setPosts] = useState<Post[]>(formattedPost);
        const [nextPage, setNextPage ] = useState(postsPagination.next_page);
        const [currentPage, setCurrentPage ] = useState(1);

        async function handleNextPage(): Promise<void> {
          if (currentPage !!= 1 && nextPage === null) {
            return;
          }

        const postResult = await fetch(`${nextPage}`).then(response =>
          response.json()
          );
          setNextPage(postResult.next_page);
          setCurrentPage(postResult.page);

          const newPosts = postResult.results.map(post => {
            return {
              uid: post.uid,      
              first_publication_date:format(
                new Date(post.first_publication_date), 
                'dd MMM yyyy',
                {
                  locale: ptBR,              
                }),
              data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            }
          }
       })       


       setPosts([...posts, ...newPosts]);

    } 
  
  
   return (
     <>
     <Head>
          <title>Home | spacetraveling</title>
        </Head>
      <main className={commonStyles.container}>
        <Header />
        <div className={styles.posts}>
       {posts.map(post => (
              <Link href={`/post/${post.uid}`} key={post.uid}>
              <a className={styles.post} >
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <ul>
                  <li>
                    <FiCalendar />
                    {post.first_publication_date}
                  </li>
                  <li>
                    <FiUser />
                    {post.data.author}
                  </li>
                </ul>
              </a>
            </Link>

       ))}
          {nextPage && (

            <button type="button" onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
     </>
   );
 }

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();
    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'posts'),
    ], {
      pageSize: 1,
    }

    );

    const posts = response.results.map(post => {
      return {
        uid: post.uid,      
        first_publication_date: post.first_publication_date,
        data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
          }
      }
    })

    const postsPagination = {
      next_page: response.next_page,
      results: posts,
    }
   
    return { 
      props: {
        postsPagination,
      }
    }
 };
