import spinner from './spinner.svg';

const Spinner =()=> {
    return (
      <div className='text-center'>
        <img src={spinner} alt="Loading"/>
      </div>
    )
  
}

export default Spinner;