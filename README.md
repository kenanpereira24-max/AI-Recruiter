This Website uses PERN stack where PostgreSQL to store user data which is hosted by Neon 
The frontend is React using Vite framework deployed on Vercel
The backend is Node.js and Express.js and it is connected to the Database using environmental variables deployed on Render
The website code is stored on github 
JWT is used for Session Management 

Security:
This website uses hashing technique bcrypt to encrypt the password and ensure that SQL injections cannot be used to obtain user details 

Actual working:
It builds on your prompts and generates a resume based on the content that you fill
It uses Gemini's LLM to generate content

Limitations:
It has a fixed UI for all resumes which can be improved
The sessions log off if you refresh
