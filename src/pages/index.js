import { useEffect, useState } from "react";
import Sentiment from "sentiment";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [commentsList, setCommentsList] = useState([]);
  const [sentList,setSentiList]=useState([])
  const [result, setResult] = useState({
    positive:0,
    neutral:0,
    negative:0
  })

  async function fetchComments(videoId) {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?videoId=${videoId}&key=AIzaSyBcZkihhhLCLsKv2ncOic0E3_XWOx3H9Ic&part=snippet,replies&maxResults=100`
    );
    const data = await response.json();

    const comments = data.items.map(
      (item) => item.snippet.topLevelComment.snippet.textDisplay
    );

    return comments;
  }

  async function handleClick() {
    const url = new URL(inputValue);
    const { search } = url;
    const videoId = search.slice(3, 17);

    const comments = await fetchComments(videoId);
    console.log(comments.length)
    setCommentsList(comments);
  }

  useEffect(() => {
    var eksentiList=[];
    if (commentsList.length > 0) {
      for (let i = 0; i < commentsList.length; i++) {
        const sentiment = new Sentiment();
        eksentiList = [...eksentiList,sentiment.analyze(commentsList[i]).score];
      }
      setSentiList(eksentiList);
    } 
    let positive = 0;
    let neutral = 0;
    let negative = 0;
    eksentiList.forEach(element => {
      if (element > 0) {
        positive++;
      } else if (element === 0) {
        neutral++;
      } else {
        negative++;
      }
    });
    setResult({positive,neutral,negative});
  }, [commentsList]);

  return (
    <main className={`flex min-h-screen flex-col items-center`}>
      <nav className="border p-7 w-full flex justify-between sm:p-2">
        <div className=" text-3xl font-bold sm:text-xl"><span className="text-green-500">HappyorSad</span>.vercel.app</div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="40px" height="40px" viewBox="0 0 32 32" version="1.1">
          <path d="M10.895 7.574c0 7.55 5.179 13.67 11.567 13.67 1.588 0 3.101-0.38 4.479-1.063-1.695 4.46-5.996 7.636-11.051 7.636-6.533 0-11.83-5.297-11.83-11.83 0-4.82 2.888-8.959 7.023-10.803-0.116 0.778-0.188 1.573-0.188 2.39z"/>
        </svg>
      </nav>
      <div className="text-4xl font-bold m-10 mb-5 sm:text-2xl mx-3">Free Youtube Comments Analyzer</div>
      <div className="text-2xl text-gray-500 sm:text-2xl mx-3">Get your youtube video comments analyzed in seconds</div>
      <div className="border-8 flex items-strech w-1/2 h-16 mt-10 border-green-200 sm:w-11/12">
          <input type="text" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                className=" text-xl grow me-2 placeholder:text-gray-700 pl-5 focus:outline-none sm:text-sm"
                placeholder="Paste your video link here..." 
          ></input>
          <button className="bg-green-800 h-full w-20 text-white sm:w-16"> Go </button>
      </div>
      <div className="border-8 flex items-strech w-1/2 mt-10 bg-green-200 border-green-200 text-black text-xl p-2 h-min sm:w-11/12">
        👽 This Analyzer is not 100% accurate
      </div>
      <div className=" font-bold text-xl m-10 ">
        Support us : 
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 30 30" className="inline-block ms-2">
          <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
        </svg> 
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48" className="inline-block ms-2">
          <path fill="#0288D1" d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"></path><path fill="#FFF" d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"></path>
        </svg>
      </div>
        <div style={{marginTop:"20px",height:"20px",width:2*result.positive+"px",backgroundColor:"green",display:"inline-block"}}></div>
        <div style={{marginTop:"20px",height:"20px",width:2*result.neutral+"px",backgroundColor:"grey",display:"inline-block"}}></div>
        <div style={{marginTop:"20px",height:"20px",width:2*result.negative+"px",backgroundColor:"red",display:"inline-block"}}></div>
    </main>
  );
}
