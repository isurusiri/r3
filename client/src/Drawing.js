import React, { Component } from 'react';
import Canvas from 'simple-react-canvas';
import { publishLine, subscribeToDrawingLines } from './api';

class Drawing extends Component {
    state = {
        lines: [],
    };

    componentDidMount() {
        subscribeToDrawingLines(this.props.drawing.id, (linesEvent) => {
            this.setState((prevState) => {
                return {
                    lines: [...prevState.lines, ...linesEvent.lines],
                };
            });
        });
    }

    handleDrawing = (line) => {
        publishLine({
            drawingId: this.props.drawing.id,
            line,
        });
    };

    render() {
        return (this.props.drawing) ? (
            <div className="Drawing">
                <div className="Drawing-title">
                    {this.props.drawing.name}
                    ({this.state.lines.length})
                </div>
                <Canvas 
                    drawingEnabled={true} 
                    onDraw={this.handleDrawing}
                    lines={this.state.lines}
                />
            </div>
        ) : null;
    }
}

export default Drawing;
