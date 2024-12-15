"use client";
import React, { useState, useEffect,useCallback,useRef  } from "react";
import Image from "next/image";
import cat from "../../public/cat.webp";
import ilu from "../../public/iloveu.jpeg";
import "./globals.css";

const App = () => {
  const [detailedMessage, setDetailedMessage] = useState("");
  const [showDetailedMessage, setShowDetailedMessage] = useState(false);
  const [images, setImages] = useState([]);
  const [isTextShown, setIsTextShown] = useState(false);
  const [isClient, setIsClient] = useState(false); // To ensure content is rendered on the client
  const [showCat, setShowCat] = useState(false); // To show cat after message is typed

  const message = "Happy Birthday em Bé iu Tờ Hiên 🎉";
  const words = message.split(" "); // Split message into words

  const fullMessage =
    "Chúc em có một tuổi mới ngày càng thương ta hơn, iu thương ta về sớm chơi với dinhhung, Dinhhung chúc tất cả mọi thứ tốt đẹp cho em, hun em chụt chụt. Happy Birthday Em! 🎉";

  const imageList = [
    "https://plus.unsplash.com/premium_vector-1723038733000-ff4ec25c7138?q=80&w=3600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1723038733000-ff4ec25c7138?q=80&w=3600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_vector-1723038733000-ff4ec25c7138?q=80&w=3600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  // Define typeMessage first
  const typeMessage = (text, index) => {
    if (index < text.length) {
      setDetailedMessage((prev) => prev + text.charAt(index));
      setTimeout(() => typeMessage(text, index + 1), 50);
    } else {
      setRandomImages();
      setShowCat(true); // Show cat after the message is fully typed
    }
  };

  useEffect(() => {
    setIsClient(true); // Set to true after the component mounts (client-side)
  }, []);

  const showMS = () => {
    setIsTextShown(true);
    setShowDetailedMessage(true);
    setDetailedMessage(""); // Reset message
    typeMessage(fullMessage, 0); // Type message letter by letter
  };

  const setRandomImages = () => {
    const randomImages = [];
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * imageList.length);
      const randomImage = imageList[randomIndex];

      const randomTop = Math.random() * 80 + "vh"; // Random vertical position (to prevent image from going out of screen)
      const randomLeft = Math.random() * 80 + "vw"; // Random horizontal position (to prevent image from going out of screen)

      randomImages.push({ src: randomImage, top: randomTop, left: randomLeft });

      if (randomImages.length > 10) {
        clearInterval(interval); // Stop adding images after 10
      }
    }, 500); // Every 500ms

    setImages(randomImages); // Set random images
  };

  useEffect(() => {
    createBalloons();
    setTimeout(() => {
      showMS();
    }, 3000);
  }, []);



  const createBalloons = () => {
    const balloonContainer = document.querySelector(".balloons-container");
    for (let i = 0; i < 30; i++) {
      const balloon = document.createElement("div");
      balloon.classList.add("balloon");
      balloon.style.left = `${Math.random() * 100}%`;
      balloon.style.animationDelay = `${Math.random() * 5}s`;
      balloonContainer.appendChild(balloon);
    }
  };

  // Function to play the "Happy Birthday" song after user interaction
  const audioRef = useRef(null);

  const playBirthdaySong = () => {
    const audio = document.getElementById("birthday-audio");
    if (audio) {
      audio.muted = true; // Bắt đầu phát ở chế độ tắt tiếng
      const playPromise = audio.play();
  
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Sau khi phát thành công, bật âm lượng
            setTimeout(() => {
              audio.muted = false; // Bật âm thanh sau 1 giây
              audio.volume = 1.0; // Đặt mức âm lượng
            }, 1000); // Tắt tiếng sau khi phát được
          })
          .catch((error) => {
            console.warn("Không thể phát nhạc tự động:", error);
          });
      }
    }
  };
  
  useEffect(() => {
    playBirthdaySong(); // Gọi play khi trang vừa tải
  }, []);

  const requestAudioPermission = () => {
    const audio = document.getElementById("birthday-audio");
    if (audio) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .catch(() => {
            alert("Hãy nhấp vào màn hình để nghe nhạc!");
          });
      }
    }
  };
  
  useEffect(() => {
    requestAudioPermission();
  }, []);


  const playAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          console.warn("User interaction is required to play audio.");
        });
      }
    }
  };

  return (
    <div className="container"  onClick={playAudio}>
      <div className="balloons-container"></div>
      <div className="animated-text">
        {words.map((word, index) => (
          <span
            key={index}
            className="word"
            style={{ animationDelay: `${index * 0.3}s` }}
            onClick={() => {
              showMS();
              playBirthdaySong(); // Play the audio when a word is clicked
            }}
          >
            {word}
          </span>
        ))}
      </div>
      {showDetailedMessage && (
        <p className="detailed-message">{detailedMessage}</p>
      )}
      {isClient &&
        images.map((img, index) => (
          <div
            key={index}
            className="random-image"
            style={{
              top: img.top,
              left: img.left,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <Image
              src={img.src}
              alt="Random"
              width={100}
              height={100}
              layout="intrinsic"
            />
          </div>
        ))}

      {/* Show cat and heart images */}
      {showCat && isClient && (
        <div className="cat-container">
          <Image
            src={cat}
            alt="Cat holding sign"
            width={150}
            height={150}
            layout="intrinsic"
          />
        </div>
      )}
      {showCat && isClient && (
        <div className="ilove-container">
          <Image
            src={ilu}
            alt="I love you"
            width={150}
            height={150}
            layout="intrinsic"
          />
        </div>
      )}

      <audio ref={audioRef} preload="auto">
        <source src="/audio/happy-birthday-254480.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default App;
