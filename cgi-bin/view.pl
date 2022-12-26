#!/usr/bin/perl

use DBI;
use CGI;
use strict;
use warnings;

my $q = CGI->new;
my $owner = $q->param('usuario');
my $titulo= $q->param('titulo');

# conectamos base de datos
my $user = 'alumno';
my $password = 'pweb1';
my $dsn = "DBI:MariaDB:database=pweb1;host=192.168.1.6";
my $dbh = DBI->connect($dsn, $user, $password) or die("No se pudo conectar!");;

# consultamos por la pagina en markdown
my $sth = $dbh->prepare("SELECT markdown FROM Articles WHERE owner=? AND title=?");
$sth->execute($owner,$titulo);

my @texto;
while (my @row = $sth->fetchrow_array){
  push (@texto,@row);
}

my @lineas = split "\n", $texto[0];
my $textoHTML = "";

for (my $i=0; $i<scalar(@lineas); $i++){ #para cada linea...
	my $lineaExpresada = matchLine($lineas[$i]);
	$textoHTML= $textoHTML."$lineaExpresada";
}
# añadiendo root para recibirlo en js

print $q->header('text/XML');
print "<?xml version='1.0' encoding='utf-8'?>\n";
print "<root>";
print $textoHTML;
print "</root>"

sub matchLine{
  my $linea = $_[0];

  if (!($linea =~ /^\s*$/ )){ # cuando la linea no este vacia, usamos las expresiones

    while ($linea =~ /(.*)(\*\*\*)(.*)(\*\*\*)(.*)/) {
      $linea = "$1<strong><em>$3</em></strong>$5";
    }
	while ($linea =~ /(.*)(\*\*)(.*)(\*\*)(.*)/) {
      $linea = "$1<strong>$3</strong>$5";
    }
	while ($linea =~ /(.*)(\*)(.*)(\*)(.*)/) {
      $linea = "$1<em>$3</em>$5";
    }
	
    while ($linea =~ /(.*)(\_)(.*)(\_)(.*)/){
      $linea = "$1<em>$3</em>$5";
    }

	while ($linea =~ /(.*)(\*)(.*)(\*)(.*)/) {
      $linea = "$1<em>$3</em>$5";
    }
    while ($linea =~ /(.*)(\[)(.*)(\])(\()(.*)(\))(.*)/) {
      $linea = "$1<a href='$6'>$3</a>$8";
    }

    while ($linea =~ /(.*)(\~\~)(.*)(\~\~)(.*)/){
      $linea = "$1<del>$3</del>$5";
    }

    if ($linea =~ /(\#\#\#\#\#\#)([^\S].*)/) {
      return $linea = "<h6>$2</h6>\n";
    }
    elsif ($linea =~ /(\#\#\#\#\#)([^#\S].*)/) {
      return $linea = "<h5>$2</h5>\n";
    }
    elsif ($linea =~ /(\#\#\#\#)([^#\S].*)/) {
      return $linea = "<h4>$2</h4>\n";
    }
    elsif ($linea =~ /(\#\#\#)([^#\S].*)/) {
      return $linea = "<h3>$2</h3>\n";
    }
    elsif ($linea =~ /(\#\#)([^#\S].*)/) {
      return $linea = "<h2>$2</h2>\n";
    }
    elsif ($linea =~ /(\#)([^#\S].*)/) {
      return $linea = "<h1>$2</h1>\n";
    }
    else {
      return $linea = "<p>$linea</p>\n";
    }

  }

}
