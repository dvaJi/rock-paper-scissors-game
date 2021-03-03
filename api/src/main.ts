import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.setGlobalPrefix("api");

  const options = new DocumentBuilder()
    .setTitle("Rock, Paper or Scissors Game")
    .setDescription("The Rock, Paper or Scissors Game API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  await app.listen(8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
