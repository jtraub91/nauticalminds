from app import app, db
import IPython


@app.shell_context_processor
def shell():
    IPython.embed(app=app, db=db)


if __name__ == '__main__':
    app.run()
