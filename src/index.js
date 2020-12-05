import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

const Note = React.createClass({
    render() {
        let style = {backgroundColor: this.props.color};
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}>×</span>
                {this.props.children}
                </div>
        );
    },
});
const NoteSearch = React.createClass({
    render() {
        return (
            <input className="noteSearch" type="search" placeholder="Search..." onChange={this.props.onSearch}/>
        );
    }
});
const NoteColors = React.createClass({
    render() {
        let colors = ["green", "yellow", "red"];
        return (
            <div className="colors-list">
                {
                    colors.map((el, i) => {
                        return (
                            <div key={i} style={{backgroundColor: el}}>
                                <input
                                    className="radio-custom"
                                    id={el}
                                    type="radio"
                                    name="color"
                                    onChange={(e)=>this.props.onColorChanged(e, el)}
                                />
                                <label className="radio-custom-label" htmlFor={el}/>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
});
const NoteEditor = React.createClass({
    getInitialState() {

        this._hadleColorChange = this.hadleColorChange.bind(this);

        return {
            text: '',
            color: '',
            checked: false
        }
    },
    hadleTextChange(e) {
        this.setState({
            text: e.target.value
        })
    },
    hadleColorChange(e, color) {
        this.input = e.target;
        this.setState({
            color: color,
            checked: e.target.checked
        })
    },
    handleNoteAdd() {
        if(this.state.text.length) {
            let newNote = {
                about: this.state.text,
                color: this.state.color,
                id: new Date()
            };
            this.props.onNoteAdd(newNote);
            this.setState({
                text: '',
                color: '',
                checked: false
            });
            if(this.state.checked) this.input.checked = false;
        }
    },
    render() {
        return (
            <div className="note-editor">
                <textarea
                    className="textarea"
                    placeholder="Enter your note here..."
                    rows={5}
                    value={this.state.text}
                    onChange={this.hadleTextChange}>
                </textarea>
                <div className="controls">
                    <NoteColors onColorChanged={this._hadleColorChange}/>
                    <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
                </div>
            </div>
        );
    }
});
const NoteGrid = React.createClass({
    getInitialState() {
        return {
            value: ''
        }
    },
    componentDidMount() {
        this.msnry = new Masonry( this.grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10
        });
    },
    componentDidUpdate(prevProps, prevState) {
        if(this.props.notes.length != prevProps.notes.length || this.state.value.length != prevState.value.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },
    handleSearch(e) {
        this.setState({
            value: e.target.value
        });
    },
    render() {
        let searchQuery = this.state.value.toLowerCase();
        let displayedNotes = !this.state.value ? this.props.notes : this.props.notes.filter(function(item) {
            let searchValue = item.about.toLowerCase();
            return searchValue.indexOf(searchQuery) !== -1;
        });
        console.log(displayedNotes);
        return (
            <div>
                <NoteSearch onSearch={this.handleSearch}/>
                <div ref={(div) => this.grid = div} className="notes-grid">
                    {
                        displayedNotes.map((note) => {
                            return (
                                <Note
                                    key={note.id}
                                    color={note.color}
                                    onDelete={this.props.onNoteDelete.bind(null, note)}
                                >{note.about}</Note>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
});
const NoteApp = React.createClass({
    getInitialState() {
      return {
          // notes: this.props.notes
          notes: []
      }
    },
    componentDidMount() {
        let localNotes = JSON.parse(localStorage.getItem('notes'));
        if(localNotes) {
            this.setState({
                notes: localNotes
            })
        }
    },
    componentDidUpdate() {
        this.updateLocalStorage();
    },
    handleDeleteNote(note) {
        let noteId = note.id;
        let newNotes = this.state.notes.filter(function (note) {
            return note.id != noteId;
        });
        this.setState({
            notes: newNotes
        })
    },
    handleNoteAdd(newNote) {
        this.setState({
            notes: [newNote, ...this.state.notes]
        })
    },
    render() {
        return (
            <div className="notes-app">
                <h2 className="app-header">Notes App</h2>
                <NoteEditor onNoteAdd={this.handleNoteAdd}/>
                <NoteGrid notes={this.state.notes} onNoteDelete={this.handleDeleteNote}/>
            </div>
        );
    },
    updateLocalStorage() {
        let notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(<App />, document.getElementById("root"));
