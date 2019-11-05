var data = [
    {author: "Mario Rossi", text: "Il mio commento"},
    {author: "Elena Verdi", text: "Un *commento* colorato"} 
];

class CommentBox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
        }

        handleCommentSubmit(comment){
            $.ajax({
                url: this.props.url,
                dataTyple: 'json',
                type: 'GET',
                data: comment,
                success: function(data) {
                    this.setState({data: data});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.url, status, errr.toString());
                }.bind(this)
            });
        }
        

    
    loadCommentsFromServer(){

        $.ajax({
            url: this.props.url,
            dataTyple: 'json',
            type: 'GET',
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, errr.toString());
            }.bind(this)
        });
    }

    componentDidMount(){
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer.bind(this), this.props.pollInterval);
    }

    render() {
        return(
            <div className="commentBox">
                <h1>Lista dei commenti</h1>
                <CommentList data={this.state.data} />
                <CommentForm handleCommentSubmit={this.handleCommentSubmit.bind(this)}/>
            </div>
        );
    }
};

class Comment extends React.Component {
    rawMarkup(myMarkupString) {
        var md = new Remarkable();
        var rawMarkup = md.render(myMarkupString);
        return { __html: rawMarkup };
    }
    
    render() {

        var md = new Remarkable();

        return(
            <div className="content">
                <h2 className="contentAutor">
                    { this.props.author }
                </h2>
                <span dangerouslySetInnerHTML ={this.rawMarkup(this.props.children)}></span>
            </div>
        );
    }
};


class CommentList extends React.Component {
    
    render() {
        
        var risultatoMappaCommenti = this.props.data.map((msg, indice) =>
            {return (
                <Comment key={indice} className="comment" author={msg.author}>
                    {msg.text}
                </Comment>
            );
            }
    );

        return(
            <div className="commentList">
                {risultatoMappaCommenti}
            </div>
        );
    }
};

class CommentForm extends React.Component {

    handleSubmit = (event) => {
        event.preventDefault(); //impido el comportamiento de Default
        var author= ReactDOM.findDOMNode(this.refs.author).value;
        var text = ReactDOM.findDOMNode(this.refs.text).value;

        if (!text || !author){
            return;
        }

        //TODO chiama al server e fa la POST
        console.log("SERVEEER!!!"+author+" "+text);
        this.props.onCommentSubmit({ author: author, text: text });

        //Pulisco valori dopo l'invio al server
        ReactDOM.findDOMNode(this.refs.author).value = '';
        ReactDOM.findDOMNode(this.refs.text).value = '';

        return;

    }

    render() {
        return(
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Il tuo nome" ref="author"/>
                <input type="text" placeholder="Il tuo commento" ref="text"/>
                <input type="submit" value="Invia"/>
            </form>
        );
    }
};

ReactDOM.render(
    <CommentBox url="/api/comments" pollInterval="2000"/>,
    document.getElementById(`content`)
);