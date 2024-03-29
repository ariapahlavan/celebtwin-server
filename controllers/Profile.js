const retreive = db => (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({id})
    .then(user => {
      if (user.length>0) { res.json(user[0]); }
      else { res.status(400).json('no such user'); }
    })
    .catch(err => res.status(400).json('error getting user'));
};


module.exports = {
  retreive: retreive
};
