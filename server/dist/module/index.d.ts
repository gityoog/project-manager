import { MiddlewareConsumer, NestModule } from "@nestjs/common";
import { DataSource } from 'typeorm';
import { RequestHandler } from "express";
export default class AppModule implements NestModule {
    private session;
    private db;
    constructor(session: RequestHandler, db: DataSource);
    configure(consumer: MiddlewareConsumer): void;
}
