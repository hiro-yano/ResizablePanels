import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface Props {
    isDragging: boolean,
    currentPanel: number,
    panels: number[],
    initialPos: number,
    delta: number
}
class Application extends React.Component<{}> {
  constructor (props: Props) {
    super(props);
    this.state = {
      
    };
  }
  
  render() {
    return (
      <div>
        <h1>ReactJS Resizable Panels</h1>
        <ResizablePanels>
          <div>
            This is the first panel. It will use the rest of the available space.
          </div>
          <div>
            This is the second panel. Starts with 300px.
          </div>
          <div>
            This is the third panel. Starts with 300px.
          </div>
        </ResizablePanels>
      </div>
    )
  }
}

class ResizablePanels extends React.Component<{},Props> {
  eventHandler = null

  constructor (props: {}) {
    super(props)
    
    this.state = {
      isDragging: false,
      currentPanel: 0,
      panels: [300, 300, 300],
      initialPos: 0,
      delta: 0
    }
  }

  componentDidMount () {
    window.addEventListener('mousemove', this.resizePanel)
    window.addEventListener('mouseup', this.stopResize)
    window.addEventListener('mouseleave', this.stopResize)
  }
  
  startResize = (event:React.MouseEvent<HTMLDivElement, MouseEvent>, index:number) => {
    this.setState({
      isDragging: true,
      currentPanel: index,
      initialPos: event.clientX
    })
  }
  
  stopResize = () => {
    if (this.state.isDragging) {
      console.log(this.state)
      this.setState(({panels, currentPanel, delta}) => ({
        isDragging: false,
        panels: {
          ...panels,
          [currentPanel]: (panels[currentPanel] || 0) - delta,
          [currentPanel - 1]: (panels[currentPanel - 1] || 0) + delta
        },
        delta: 0,
        currentPanel: 0
      }))
    }
  }
  
  resizePanel = (event:any) => {
    if (this.state.isDragging) {
      const delta = event.clientX - this.state.initialPos
      this.setState({
        delta: delta
      })
    }
  }
  
  render() {
    if(this.props.children != null){
      let children = React.Children.toArray(this.props.children);
      const rest = children.slice(1)
      const nodes: React.ReactNode[] = [];
      return (
        <div className="panel-container" onMouseUp={() => this.stopResize()}>
          <div className="panel" style={{ width: `calc(100% - ${this.state.panels[1]}px - ${this.state.panels[2]}px)` }}>
            {children[0]}
          </div>
          {nodes.concat(...rest.map((child, i) => {
            return [
              <div onMouseDown={(e) => this.startResize(e, i + 1)}
                key={"resizer_" + i}
                style={this.state.currentPanel === i + 1 ? { left: this.state.delta } : {}}
                className="resizer"></div>,
              <div key={"panel_" + i} className="panel" style={{ width: this.state.panels[i + 1] }}>
                {child}
              </div>
            ]
          }))}
        </div>
      )
    }else{
      return (
        <div></div>
      )
    }

  }
}

/*
 * Render the above component into the div#app
 */
ReactDOM.render(<Application />, document.getElementById('root'));