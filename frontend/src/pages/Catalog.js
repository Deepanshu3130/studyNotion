import React from 'react'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector';
import { categories } from '../services/api';
import { useState, useEffect } from 'react';
import { getCatalogaPageData } from '../services/operations/catalogData';
import { fetchCourseCategories } from '../services/operations/courseDetailsApi';
import CourseSlider
 from '../component/core/catalog/CourseSlider';

function Catalog() {
    const{CATEGORIES_API} = categories

    const prams = useParams();
    const [categoryID , setcategoryID] = useState(null);
    const [CatalogPageData , setCatalogData] =useState(null);
    const [activeOption, setActiveOption] = useState(1);
    const [Desc, setDesc] = useState([]);

     const fetchSublinks = async()=>{
        try{
            console.log(CATEGORIES_API);
            // const result = apiConnector("GET" , CATEGORIES_API)
         const result = await fetchCourseCategories()
        const category_id = result.filter((item)=> item.name === prams.catalog)[0]._id;
        setDesc(result.filter((item)=>item.name=== prams.catalog)[0]);
        console.log(category_id)
         console.log("reslult is ",result)
        setcategoryID(category_id);


        }catch(error){
            console.log("could not fetch sublinks");
            console.log(error);
        }

     }

     useEffect(() => {
        fetchSublinks();
    }, [prams]);

    useEffect(()=>{
        const fetchCatalogPageData = async ()=> {
            const result = await getCatalogaPageData(categoryID);
            setCatalogData(result)
        }
        if (categoryID) {
            fetchCatalogPageData();
        }
    }, [categoryID])



  return (
    <div>
    {/* secton one */}

     <div className=' box-content bg-richblack-800 px-4 mx-auto flex min-h-[260px]  flex-col justify-center gap-4 '>
        <p className='text-sm text-richblack-300'>Home / Catalog / <span className='text-yellow-25'>{prams.catalog}</span> </p>
        <h2  className='text-3xl text-richblack-5'>{prams.catalog}</h2>
        <p className='max-w-[870px] text-richblack-200'> {Desc.description}</p>
     </div>

     <div>
     <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
        <h2  className="section_heading">
        Courses to get you started
        </h2>
        <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
          <button onClick={()=>{setActiveOption(1)}}  className={activeOption===1? `px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer`:`px-4 py-2 text-richblack-50 cursor-pointer` }>Most Populer</button>
          <button onClick={()=>{setActiveOption(2)}} className={activeOption===1?'px-4 py-2 text-richblack-50 cursor-pointer':'px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer'}>New</button>
        </div>
         <CourseSlider Courses={CatalogPageData?.selectedCourses}/>     
      </div>
        {/* <CourseSlider></CourseSlider> */}
        <div className=' mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
        <h2 className='section_heading mb-6 md:text-3xl text-xl'>
          Similar to {prams.catalog}
        </h2>
        <CourseSlider Courses={CatalogPageData?.differentCourses}/>
      </div>
        {/* <div> 
        <h2> Frequently Bought Together</h2>
          {/* here card rendering is left      NOTE- this part is pending i am getting the data, will see later on

        </div> */}
     </div>

    </div>
  )
}

export default Catalog