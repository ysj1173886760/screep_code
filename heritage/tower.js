var Tower =
{
    run: function(tower)
    {
        //console.log('running');
        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile)
        {
            tower.attack(closestHostile);
        }
    }
};

module.exports = Tower;