function formatDate(str, fw = 'cn', events = {}) {
  const today = new Date(str)
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const lastDay = new Date(year, month, 0)
  const lastDatePre = new Date(year, today.getMonth(), 0).getDate()
  const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
  const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`

  let f = ['cn', 't2', 't3', 't4', 't5', 't6', 't7']
  let fd = new Date(formattedFirstDay).getDay()
  let s = lastDay.getDate()
  const ps1 = []
  const ps = []

  let sdf = Array(s).fill().map((v, i) => ({
    d: `${year}-${month.toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`,
    isCM: 'current'
  }))

  const idW = f.findIndex(st => st.toLowerCase() === fw.toLowerCase()) // 0: cn, 1: t2, 2: t3, 3: t4, 4: t5, 5: t6, 6: t7
  let fg = 0
  if (fd >= idW) {
    fg = fd - idW
  } else {
    fg = 7 + fd - idW
  }

  for (let i = 0; i < fg; i++) {
    sdf.unshift({d: (lastDatePre - i).toString(), isCM: 'pass'})
  }

  for (let ii of sdf) {
    let dt = ii.d
    if (ii.isCM === 'pass') {
      const datePre = new Date(`${year}-${month.toString().padStart(2, '0')}-01`)
      datePre.setMonth(datePre.getMonth() - 1)
      dt = `${datePre.getFullYear()}-${(datePre.getMonth() + 1).toString().padStart(2, '0')}-${ii.d.toString().padStart(2, '0')}`
    }

    let sf = new Date(dt);
    let k = null
    if (!isNaN(sf.getDay())) {
      k = f[sf.getDay()]
    }

    ps1.push({
      d: dt,
      k,
      sf: sf.getDay(),
      isCM: ii.isCM,
      ...events[ii.d] && {event: events[ii.d]}
    })
  }

  // Chunk 7
  for (let i = 0; i < ps1.length; i++) {
    let c = ps1.slice(i, 7 + i);
    if (c.length !== 7) {
      let rf = Array(7 - c.length).fill().map((v, i) => {
        const dateNext = new Date(`${year}-${month.toString().padStart(2, '0')}-${(i + 1).toString().padStart(2, '0')}`)
        dateNext.setMonth(dateNext.getMonth() + 1)

        let k = null
        if (!isNaN(dateNext.getDay())) {
          k = f[dateNext.getDay()]
        }
        return {
          d: `${dateNext.getFullYear()}-${(dateNext.getMonth() + 1).toString().padStart(2, '0')}-${dateNext.getDate().toString().padStart(2, '0')}`,
          k,
          sf: dateNext.getDay(),
          isCM: 'feature',
        }
      })
      c = c.concat(...rf)
    }
    ps.push(c)

    i = 6 + i
  }


  console.debug(ps)

  return {
    f, fd, s, ps, formattedFirstDay, formattedLastDay
  }
}

formatDate('2023-01-08', 't2', {'2023-01-22': [{d: '2023-01-22', title: 't2-text'}]})
