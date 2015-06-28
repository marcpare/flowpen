macro I {
	rule { ($x:expr, $y:expr, $offset) } => {
		(((($x < 0 ? 0 : ($x > WIDTH-1 ? WIDTH-1 : $x))|0)+
		  (($y < 0 ? 0 : ($y > HEIGHT-1 ? HEIGHT-1 : $y))|0)*
		  WIDTH)*2+$offset)
	}
}

macro LERP {
  rule { ($a:expr, $b:expr, $c:expr) } => {
    ($a  * (1- ($c < 0 ? 0 : ($c > 1 ? 1 : $c))) + $b*$c)
  }
}

export I;
export LERP;