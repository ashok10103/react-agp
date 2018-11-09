const getFormatedMessage = (unBookedSlots) => {
  if (unBookedSlots && unBookedSlots.length) {
    const alreadyBooked = [];
    const unavailableSlots = [];
    unBookedSlots.map((unbooked) => {
      if (unbooked.alreadyBookedSlots && unbooked.alreadyBookedSlots.length) {
        alreadyBooked.push(`${unbooked.bookingDate} : ${unbooked.alreadyBookedSlots.toString()}`)
      }
      if (unbooked.unavailableSlots && unbooked.unavailableSlots.length) {
        unavailableSlots.push(`${unbooked.bookingDate} : ${unbooked.unavailableSlots.toString()}`)
      }
    })
    const message = `${alreadyBooked.length ?
      `You have already booked slots for the following ${alreadyBooked.toString()}` : ''}
         ${unavailableSlots.length ?
        `Someone else booked the following slots in between ${unavailableSlots.toString()} sorry for the inconvenience` : ''}`
    return message;
  }
}

export {
  getFormatedMessage
}; 