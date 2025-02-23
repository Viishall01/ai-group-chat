import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js'
connect();


const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

app.use("/ai", aiRoutes)


app.get('/', (req, res) => {
    res.send('Hello World!');
});

export default app; 




// REDIS_HOST=redis-19413.c264.ap-south-1-1.ec2.redns.redis-cloud.com
// REDIS_PORT=19413
// REDIS_PASSWORD=Ah5LTZeYEvk78ycCijlzOsh3UznjI8LS

